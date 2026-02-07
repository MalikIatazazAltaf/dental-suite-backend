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
      // 1️⃣ ROLE RESTRICTION
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only owner or receptionist can create services'
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
// Soft delete service
exports.softDeleteService = async (req, res) => {
  try {
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only owner or receptionist can delete services'
      });
    }
    const service = await Service.findOne({
      _id: req.params.id,
      clinic_id: req.user.clinic_id
    });

    if (!service) {
      return res.status(404).json({
        message: 'Service not found'
      });
    }

    service.is_deleted = true;
    await service.save();

    res.json({
      message: 'Service deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};