const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

exports.createPayment = async (req,res) => {
  try {
    const { invoice_id, amount, method, paid_at, note } = req.body;

    const invoice = await Invoice.findOne({ _id: invoice_id, clinic_id: req.user.clinic_id });
    if(!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const payment = await Payment.create({
      invoice_id,
      amount,
      method,
      paid_at,
      note,
      clinic_id: req.user.clinic_id,
      created_by: req.user.id
    });

    // update invoice paid & balance
    invoice.total_paid += amount;
    invoice.balance_due = invoice.total - invoice.total_paid;
    if(invoice.balance_due <= 0) invoice.status = 'paid';
    else if(invoice.total_paid > 0) invoice.status = 'partial';
    await invoice.save();

    res.status(201).json({ payment });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
};
