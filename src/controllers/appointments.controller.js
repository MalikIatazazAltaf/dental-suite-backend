const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Service = require('../models/Service');
exports.getAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);

    const appointments = await Appointment.find({
      clinic_id: req.user.clinic_id,
      start_at: { $gte: start, $lte: end },
      source: 'scheduled'
    });
    const walkins = await Appointment.find({
      clinic_id: req.user.clinic_id,
      start_at: { $gte: start, $lte: end },
      source: 'walk_in'
    });

    res.json({ appointments, walkins });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.createAppointment = async (req, res) => {
//   // samme clinic ki appointment k liye hamay clinic id aur user ka role chaiye hoga

//   try {
//     const { patient_id, dentist_id, service_id, start_at, duration_minutes, fee_snapshot, status, source } = req.body;
//     const end_at = new Date(new Date(start_at).getTime() + duration_minutes*60000);

//     const appointment = await Appointment.create({
//       patient_id, dentist_id, service_id, start_at, end_at,
//       fee_snapshot, status, source,
//       clinic_id: req.user.clinic_id, created_by: req.user.id
//     });

//     res.status(201).json(appointment);
//   } catch(err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.createAppointment = async (req, res) => {
  try {
    const clinicId = req.user.clinic_id;
    const userRole = req.user.role;

    // 🔒 Role restriction
    if (!['owner', 'receptionist', 'dentist'].includes(userRole)) {
      return res.status(403).json({ message: 'Not allowed to create appointment' });
    }

    const {
      patient_id,
      dentist_id,
      service_id,
      start_at,
      duration_minutes,
      fee_snapshot,
      status,
      source
    } = req.body;
    const end_at = new Date(new Date(start_at).getTime() + duration_minutes*60000);
    // ---------------------------
    // 🔍 VALIDATIONS (CRITICAL)
    // ---------------------------

    // 1️⃣ Patient must belong to same clinic
    const patient = await Patient.findOne({
      _id: patient_id,
      clinic_id: clinicId
    });
    if (!patient) {
      return res.status(400).json({ message: 'Invalid patient for this clinic' });
    }

    // 2️⃣ Dentist must belong to same clinic AND role dentist
    // const dentist = await User.findOne({
    //   _id: dentist_id,
    //   clinic_id: clinicId,
    //   role: 'dentist'
    // });
    // if (!dentist) {
    //   return res.status(400).json({ message: 'Invalid dentist for this clinic' });
    // }
      // 2️⃣ Provider (Dentist OR Owner) must belong to same clinic
const provider = await User.findOne({
  _id: dentist_id,
  clinic_id: clinicId,
  role: { $in: ['dentist', 'owner'] }
});

if (!provider) {
  return res.status(400).json({
    message: 'Appointment can only be assigned to dentist or owner of same clinic'
  });
}

    // 3️⃣ Service must belong to same clinic
    const service = await Service.findOne({
      _id: service_id,
      clinic_id: clinicId
    });
    if (!service) {
      return res.status(400).json({ message: 'Invalid service for this clinic' });
    }

    // 4️⃣ Dentist self-rule
    if (userRole === 'dentist' && req.user.id.toString() !== dentist_id) {
      return res.status(403).json({
        message: 'Dentist can only create appointments for himself'
      });
    }

    // ---------------------------
    // ✅ CREATE APPOINTMENT
    // ---------------------------
    const appointment = await Appointment.create({
      clinic_id: clinicId,
      patient_id,
      dentist_id,
      service_id,
      start_at,
      end_at,
      duration_minutes,
      fee_snapshot,
      status,
      source,
      created_by: req.user._id
    });

    res.status(201).json(appointment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.createWalkin = async (req, res) => {
  try {
    const { patient_id, service_id, dentist_id, fee_snapshot } = req.body;

    // Token number logic: last walkin of the day
    const today = new Date();
    today.setHours(0,0,0,0);
    const count = await Appointment.countDocuments({ clinic_id: req.user.clinic_id, source: 'walk_in', start_at: { $gte: today } });
    const token_number = `W-${String(count+1).padStart(3,'0')}`;

    const appointment = await Appointment.create({
      patient_id, service_id, dentist_id,
      fee_snapshot,
      source: 'walk_in',
      status: 'booked',
      token_number,
      start_at: new Date(),
      end_at: new Date(new Date().getTime() + 30*60000), // default 30min
      clinic_id: req.user.clinic_id,
      created_by: req.user.id
    });

    res.status(201).json({ appointment_id: appointment._id, token_number });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, clinic_id: req.user.clinic_id },
      { status },
      { new: true }
    );
    if(!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
