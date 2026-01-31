const User = require('../models/User');
const Clinic = require('../models/Clinic');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: generate token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, clinic_id: user.clinic_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Basic required validation
//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const password_hash = await bcrypt.hash(password, 10);

//     let clinicId;

//     if (role === 'owner') {
//       // Owner must provide all clinic fields
//       const {
//         clinic_name,
//         phone,
//         address,
//         logo_url,
//         timezone,
//         tax_enabled_default,
//         receipt_footer_note,
//         working_hours
//       } = req.body;

//       // Validate required clinic fields
//       if (!clinic_name) {
//         return res.status(400).json({ message: 'Clinic name is required for owner' });
//       }

//       const clinic = await Clinic.create({
//         name: clinic_name,
//         phone: phone || '',
//         address: address || '',
//         logo_url: logo_url || '',
//         timezone: timezone || 'Asia/Karachi',
//         tax_enabled_default: tax_enabled_default || false,
//         receipt_footer_note: receipt_footer_note || '',
//         working_hours: working_hours || { mon_fri: '09:00-18:00' }
//       });

//       clinicId = clinic._id;

//     } else {
//       // Receptionist or dentist
//       const { clinic_name } = req.body;
//       if (!clinic_name) {
//         return res.status(400).json({ message: 'Clinic name is required' });
//       }

//       const clinic = await Clinic.findOne({ name: clinic_name });
//       if (!clinic) {
//         return res.status(404).json({ message: 'Clinic not found' });
//       }
//       clinicId = clinic._id;
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password_hash,
//       role,
//       clinic_id: clinicId
//     });

//     // JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role, clinic_id: user.clinic_id },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         clinic_id: user.clinic_id
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
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
    if (!name || !email || !password || !clinic_name || !phone ||!address  || ! timezone || !tax_enabled_default || !receipt_footer_note || !working_hours
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
      is_active: true
    });

    // JWT
    const token = jwt.sign(
      { id: user._id, role: 'owner', clinic_id: user.clinic_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: 'owner',
        clinic_id: user.clinic_id
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

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
