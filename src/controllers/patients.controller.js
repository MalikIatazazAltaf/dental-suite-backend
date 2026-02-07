const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

exports.getPatients = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const query = {
      clinic_id: req.user.clinic_id,
      is_deleted: false,
      name: { $regex: search, $options: 'i' }
    };
    const patients = await Patient.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ patients });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    // 1️⃣ ROLE RESTRICTION
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only owner or receptionist can create patients'
      });
    }
    const { name, phone, email, notes_light } = req.body;
    const patient = await Patient.create({
      name, phone, email, notes_light,
      clinic_id: req.user.clinic_id,
      created_by: req.user.id
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, clinic_id: req.user.clinic_id });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const recent_appointments = await Appointment.find({ patient_id: patient._id }).sort({ start_at: -1 }).limit(5);
    const recent_invoices = await Invoice.find({ patient_id: patient._id }).sort({ created_at: -1 }).limit(5);

    res.json({ patient, recent_appointments, recent_invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//soft delete patient - owner and receptionist can do it
exports.softDeletePatient = async (req, res) => {
  try {
     if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only owner or receptionist can delete patients'
      });
    }
    const patient = await Patient.findOne({
      _id: req.params.id,
      clinic_id: req.user.clinic_id
    });

    if (!patient) {
      return res.status(404).json({
        message: 'Patient not found'
      });
    }

    patient.is_deleted = true;
    await patient.save();

    res.json({
      message: 'Patient deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
