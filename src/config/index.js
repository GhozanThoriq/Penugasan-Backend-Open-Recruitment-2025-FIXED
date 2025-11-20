const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connection.on('connected', () => console.log('🔥 MongoDB connected (event)'));
  mongoose.connection.on('error', (err) => console.error('❌ MongoDB connection error (event):', err.message));
  mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

  try {
    // optional: add options kalau versi mongoose/nginx butuh
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // mongoose v6+ sudah default
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 5000, // cepat timeout kalau gak ketemu
    });
    console.log('🔥 MongoDB Connected (after await)');
  } catch (err) {
    console.error('❌ MongoDB Connection Error (catch):', err.message);
    process.exit(1); // hentikan proses kalau koneksi wajib
  }
};

module.exports = connectDB;
