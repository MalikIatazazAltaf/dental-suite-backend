const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

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

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      clinic_id: req.user.clinic_id,
      is_active: true,
      created_by: req.user.id
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        clinic_id: user.clinic_id,
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
