const mongoose = require('mongoose');

const DB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected')
    } catch (e) {
        console.error("DB Connection Error", e);
        process.exit(1);
    }
}

module.exports = DB;
