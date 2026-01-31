const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

exports.dailyReport = async (req,res) => {
  try {
    const { date } = req.query;
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);

    const appointments = await Appointment.find({ clinic_id: req.user.clinic_id, start_at: { $gte:start, $lte:end } });
    const invoices = await Invoice.find({ clinic_id: req.user.clinic_id, created_at: { $gte:start, $lte:end } });

    res.json({ appointments_count: appointments.length, invoices_count: invoices.length, invoices_total: invoices.reduce((sum,i)=>sum+i.total,0) });
  } catch(err){ res.status(500).json({ message: err.message }); }
};

exports.monthlyReport = async (req,res) => {
  try {
    const { month } = req.query; // "2026-01"
    const start = new Date(`${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth()+1,0,23,59,59,999);

    const appointments = await Appointment.find({ clinic_id: req.user.clinic_id, start_at: { $gte:start, $lte:end } });
    const invoices = await Invoice.find({ clinic_id: req.user.clinic_id, created_at: { $gte:start, $lte:end } });

    res.json({ appointments_count: appointments.length, invoices_count: invoices.length, invoices_total: invoices.reduce((sum,i)=>sum+i.total,0) });
  } catch(err){ res.status(500).json({ message: err.message }); }
};
