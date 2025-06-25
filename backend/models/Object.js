import mongoose from 'mongoose';

const objectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    importance: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Object', objectSchema);
// This schema defines the structure of the objects in the database, including fields for id, title