const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const { sendEmail } = require('../utils/mailer');
const { generateEmailToken } = require('../utils/generateToken');
const crypto = require('crypto');
exports.createUser = async (req, res) => {
  try {
    // 🔒 only owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        message: 'Only owner can create users'
      });
    }

    const { name, email, password, role } = req.body;


    if (!['dentist', 'receptionist'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role'
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

     // 🔐 generate email verification token
    const { rawToken, hashedToken, expiresAt } = generateEmailToken();
    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      clinic_id: req.user.clinic_id,
      is_active: true,
      created_by: req.user.id,
      is_verified: false,
      email_verification_token: hashedToken,
      email_verification_expires: expiresAt
    });
    // owner + clinic info (for email)
    const owner = await User.findById(req.user.id);
    const clinic = await Clinic.findById(req.user.clinic_id);
     // 📩 Send verification email
    const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email/${rawToken}`;
    // 📧 professional + personalized email
    await sendEmail({
      to: user.email,
      subject: `You are invited to join ${clinic.name} – Dental Suite`,
      html: `
        <h2>Welcome to Dental Suite</h2>

        <p>
          <strong>${owner.name}</strong>, owner of 
          <strong>${clinic.name}</strong>, has created an account for you.
        </p>

        <p>
          To activate your account and login, please verify your email by clicking the button below:
        </p>

        <p>
          <a href="${verifyUrl}" style="padding:10px 16px; background:#2563eb; color:#fff; text-decoration:none; border-radius:4px;">
            Verify Email
          </a>
        </p>

        <p>This verification link will expire in 24 hours.</p>

        <p>If you did not expect this email, you can safely ignore it.</p>
      `
    });


    // res.status(201).json({
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     role: user.role,
    //     clinic_id: user.clinic_id,
    //   }
    // });
    res.status(201).json({
      message: 'User created successfully. Verification email sent.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// getting staff info api (for owner and recptionist to view all staff)
exports.getClinicStaff = async (req, res) => {
  try {
    // 🔒 owner + receptionist only
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Not authorized to view staff'
      });
    }

    const staff = await User.find({
      clinic_id: req.user.clinic_id
    }).select('name email role is_active created_at');

    res.json({
      count: staff.length,
      staff
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// users ko enable/disable karne ka api (owner only)
exports.toggleUserStatus = async (req, res) => {
  try {
    // 🔒 ONLY OWNER
    if (req.user.role !== 'owner') {
      return res.status(403).json({
        message: 'Only owner can enable or disable staff'
      });
    }

    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      clinic_id: req.user.clinic_id
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found in your clinic'
      });
    }

    // owner apne aap ko disable na kar sake
    if (user.role === 'owner') {
      return res.status(400).json({
        message: 'Owner cannot be disabled'
      });
    }

    user.is_active = !user.is_active;
    await user.save();

    res.json({
      message: `User ${user.is_active ? 'enabled' : 'disabled'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        is_active: user.is_active
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


