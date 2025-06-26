import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },isCorrect: {
        type: Boolean
    }

}, {
    timestamps: true
});

export default mongoose.model('Entry', entrySchema);