const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ clinic_id: req.user.clinic_id, is_deleted: false });
    res.json({ services });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createService = async (req, res) => {
   // 🔐 ROLE CHECK (HERE)
    if (req.user.role === 'dentist') {
      return res.status(403).json({
        message: 'Dentist is not allowed to create services'
      });
    }
  try {
    const { name, default_fee, default_duration_minutes, is_active } = req.body;
    const service = await Service.create({
      name, default_fee, default_duration_minutes, is_active,
      clinic_id: req.user.clinic_id,
      created_by: req.user.id
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
