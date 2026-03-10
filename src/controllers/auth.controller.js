const User = require('../models/User');
const Clinic = require('../models/Clinic');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/mailer');
const { generateEmailToken } = require('../utils/generateToken');
const crypto = require('crypto');
const { generatePasswordResetToken } = require('../utils/passwordResetToken');
// Helper: generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, clinic_id: user.clinic_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '210d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password,
      //  role,
      clinic_name,
      phone,
      address,
      logo_url,
      timezone,
      tax_enabled_default,
      receipt_footer_note,
      working_hours } = req.body;

    // Basic required validation
    // if (!name || !email || !password || !clinic_name || !phone ||!address  || ! timezone || !tax_enabled_default || !receipt_footer_note || !working_hours
    //   ) {
    //   return res.status(400).json({ message: 'Missing required fields' });
    // }
    if (!name || !email || !password || !clinic_name || !phone ||!address
      ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
     // 🔒 ONLY OWNER CAN REGISTER
    // if (role !== 'owner') {
    //   return res.status(403).json({
    //     message: 'Only clinic owner can register'
    //   });
    // }
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const clinic = await Clinic.create({
      name: clinic_name,
      phone,
      address,
      logo_url,
      timezone,
      tax_enabled_default,
      receipt_footer_note,
      working_hours
    });

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash,
      role: 'owner',
      clinic_id: clinic._id,
      is_active: true,
      is_verified: false
    });
    // 📧 Generate email verification token
    const { rawToken, hashedToken } = generateEmailToken();
    user.email_verification_token = hashedToken;
    user.email_verification_expires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await user.save();
    // 📩 Send verification email
    const verifyUrl = `${process.env.APP_URL}/api/auth/verify-email/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your Dental Suite account',
      html: `
        <h3>Welcome to Dental Suite</h3>
        <p>Please verify your email to activate your account.</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `
    });
    
    // JWT
    // const token = jwt.sign(
    //   { id: user._id, role: 'owner', clinic_id: user.clinic_id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '7d' }
    // );
    
//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: 'owner',
//         clinic_id: user.clinic_id
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
    res.status(201).json({
      message: 'Verification email sent. Please verify to login.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
/* =========================
   VERIFY EMAIL
========================= */
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      email_verification_token: hashedToken,
      email_verification_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.is_verified = true;
    user.email_verification_token = undefined;
    user.email_verification_expires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully. You can now login.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });
    // 🔒 Email not verified
    if (!user.is_verified) {
      return res.status(403).json({
        message: 'Please verify your email first'
      });
    }
    // 🔒 Account disabled
    if (!user.is_active) {
      return res.status(403).json({
        message: 'Account is disabled'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    const clinic = await Clinic.findById(user.clinic_id);

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role, clinic_id: user.clinic_id },
      entitlements: { plan: 'trial', can_export_pdf_receipt: false }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  // Frontend can just delete token, no server state needed
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const clinic = await Clinic.findById(user.clinic_id);

    res.json({
      user: { id: user._id, name: user.name, role: user.role, clinic_id: user.clinic_id },
      clinic,
      entitlements: { plan: 'trial', can_export_pdf_receipt: true }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Forgot Password ki API
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // security: don't reveal email existence
      return res.json({
        message: 'If this email exists, a reset link has been sent.'
      });
    }

    const { rawToken, hashedToken, expiresAt } =
      generatePasswordResetToken();

    user.reset_password_token = hashedToken;
    user.reset_password_expires = expiresAt;
    await user.save();

    const resetUrl = `${process.env.APP_URL}/api/auth/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your Dental Suite password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your Dental Suite password.</p>
        <p>Click the link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `
    });

    res.json({
      message: 'If this email exists, a reset link has been sent.'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset Password ki API
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      reset_password_token: hashedToken,
      reset_password_expires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        message: 'Password is required'
      });
    }

    user.password_hash = await bcrypt.hash(password, 10);

    // invalidate token
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;

    await user.save();

    res.json({
      message: 'Password reset successful. You can now login.'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
