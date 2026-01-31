//utils ma db.js ma srf humne connection logic lagayi ha remember
const mongoose=require ("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/dentalsuite_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
module.exports=connectDB;