const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb+srv://simarnarula2428:HGwDzmunZCQYVgcc@cluster0.lbfn2.mongodb.net/your-database-name?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(dbUri); 
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = { connectToDB };
