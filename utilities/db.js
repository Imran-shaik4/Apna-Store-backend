const mongoose = require('mongoose');
const url = "mongodb+srv://imranshaik8333:8688929795Imran@cluster0.r405n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
