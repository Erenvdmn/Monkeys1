import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    loginAttempts: {
        count: {type: Number, default: 0},
        lastAttempt : { type: Date},
        banUntil: { type: Date, default: null}
    }
}, {
    timestamps: true
});


export default mongoose.model('User', userSchema);