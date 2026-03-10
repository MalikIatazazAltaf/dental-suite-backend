const express = require('express');
const connectDB = require('./config/db');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors()); // allow all origins
// Connect MongoDB
// connectDB();
(async () => {
  await connectDB();
})();
require('dotenv').config(); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patients.routes');
const serviceRoutes = require('./routes/service.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const invoiceRoutes = require('./routes/invoices.routes');
const paymentRoutes = require('./routes/payment.routes');
const reportRoutes = require('./routes/reports.routes');
const userRoutes = require('./routes/user.routes');
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

module.exports = app;