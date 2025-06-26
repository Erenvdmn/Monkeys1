import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },password: {
        type: String,
        required: false
    }

}, {
    timestamps: true
});

export default mongoose.model('Entry', entrySchema);