const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Counter = require('../models/Counter');
exports.createInvoice = async (req, res) => {
  try {
    //check kro k invoice create krnay walay owner ya recep ho
    // 1️⃣ ROLE PERMISSION
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only owner or receptionist can create invoice'
      });
    }
    //checked
    const { patient_id, appointment_id, discount_type, discount_value, tax_enabled, items, notes } = req.body;
    // check krna k patient actually usi clinic ka ha ya nhii
    const patient = await Patient.findById(req.body.patient_id);

    if (!patient || patient.clinic_id.toString() !== req.user.clinic_id.toString()) {
      return res.status(400).json({
        message: 'Patient does not belong to your clinic'
      });
    }
    //checked 
    //check kro k appointment b same clinic ka ha k nhii
        let appointment = null;

    if (req.body.appointment_id) {
      appointment = await Appointment.findById(req.body.appointment_id);

      if (!appointment || appointment.clinic_id.toString() !== req.user.clinic_id.toString()) {
        return res.status(400).json({
          message: 'Appointment does not belong to your clinic'
        });
      }
    }
      // checked
      // abhi services ko b check krna k wo same clinic ki hi service ha k nhii
          for (const item of req.body.items) {
      if (item.service_id) {
        const service = await Service.findById(item.service_id);

        if (!service || service.clinic_id.toString() !== req.user.clinic_id.toString()) {
          return res.status(400).json({
            message: 'Service does not belong to your clinic'
          });
        }
      }
    }
           // checked 
    // subtotal
    let subtotal = items.reduce((sum, i) => sum + i.unit_price*i.qty, 0);

    // discount
    let discount_amount = 0;
    if(discount_type === 'percent') discount_amount = (subtotal * discount_value)/100;
    else discount_amount = discount_value || 0;

    // tax
    let tax_amount = tax_enabled ? ((subtotal - discount_amount)*0.15) : 0; // example 15%
    const total = subtotal - discount_amount + tax_amount;

    // invoice_number sequence per clinic
    // const lastInvoice = await Invoice.find({ clinic_id: req.user.clinic_id }).sort({ created_at: -1 }).limit(1);
    // const lastNumber = lastInvoice.length ? parseInt(lastInvoice[0].invoice_number.split('-')[1]) : 0;
    // const invoice_number = `INV-${String(lastNumber+1).padStart(6,'0')}`;

    //naya function invoice number k problem ko set krnay k liyay
    const counter = await Counter.findOneAndUpdate(
  { clinic_id: req.user.clinic_id },
  { $inc: { seq: 1 } },
  { new: true, upsert: true }
);

const invoice_number = `INV-${String(counter.seq).padStart(6, '0')}`;
/////yahan tak

    const invoice = await Invoice.create({
      patient_id,
      appointment_id,
      subtotal,
      discount_amount,
      tax_amount,
      total,
      total_paid: 0,
      balance_due: total,
      status: 'unpaid',
      notes,
      invoice_number : invoice_number,
      clinic_id: req.user.clinic_id,
      created_by: req.user.id
    });

    // create invoice items
    for(const item of items){
      await InvoiceItem.create({
        invoice_id: invoice._id,
        service_id: item.service_id || null,
        description: item.description,
        qty: item.qty,
        unit_price: item.unit_price,
        line_total: item.qty * item.unit_price,
        clinic_id: req.user.clinic_id,
        created_by: req.user.id
      });
    }

    res.status(201).json({ invoice });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoices = async (req,res) => {
  try {
    const { from, to, status } = req.query;
    let query = { clinic_id: req.user.clinic_id };
    if(status) query.status = status;
    if(from && to) query.created_at = { $gte: new Date(from), $lte: new Date(to) };

    const invoices = await Invoice.find(query).sort({ created_at: -1 });
    res.json({ invoices });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// PDF Receipt placeholder
// exports.getReceiptPDF = async (req,res) => {
//   try {
//     const invoice = await Invoice.findOne({ _id: req.params.id, clinic_id: req.user.clinic_id });
//     if(!invoice) return res.status(404).json({ message: 'Invoice not found' });

//     // check entitlement can_export_pdf_receipt
//     if(!req.user.can_export_pdf_receipt) return res.status(403).json({ message: 'No permission' });

//     // For demo: return simple PDF buffer
//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(Buffer.from(`PDF for invoice ${invoice.invoice_number}`));
//   } catch(err) {
//     res.status(500).json({ message: err.message });
//   }
// };


//naya function
const PDFDocument = require('pdfkit');
exports.getReceiptPDF = async (req,res) => {
  try {
     // 1️⃣ ROLE RESTRICTION
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only owner or receptionist can generate receipt PDF'
      });
    }
        // 2️⃣ INVOICE MUST BELONG TO SAME CLINIC
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      clinic_id: req.user.clinic_id
    });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found for your clinic'
      });
    } 
    // const invoice = await Invoice.findById(req.params.id);
    // if (!invoice) {
    //   return res.status(404).json({ message: 'Invoice not found' });
    // }
    //  2️⃣ ✅ ENTITLEMENT CHECK (YAHAN LIKHNA HAI)
    const clinic = await Clinic.findById(req.user.clinic_id);

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    if (clinic.plan === 'trial') {
      return res.status(403).json({ message: 'No permission' });
    }
      // 2 yahan tak ha isko remove krna ho to

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // 🔑 IMPORTANT HEADERS
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=invoice-${invoice.invoice_number}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // ---- PDF CONTENT ----
    doc.fontSize(18).text('Dental Clinic Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice #: ${invoice.invoice_number}`);
    doc.text(`Total: ${invoice.total}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Due Amount:${invoice.balance_due}`)
    doc.moveDown();

    doc.text('Thank you for visiting our clinic!', {
      align: 'center'
    });

    // FINALIZE PDF
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Soft delete invoice
exports.softDeleteInvoice = async (req, res) => {
  try {
       // 🔒 Role restriction
    if (!['owner', 'receptionist'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Not authorized to delete invoice'
      });
    }
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      clinic_id: req.user.clinic_id
    });

    if (!invoice) {
      return res.status(404).json({
        message: 'Invoice not found'
      });
    }

    invoice.is_deleted = true;
    await invoice.save();

    res.json({
      message: 'Invoice deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};