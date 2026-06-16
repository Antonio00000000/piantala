const mongoose = require('mongoose');

// ============================================================
// MODELLO del RefreshToken
// ============================================================


const refreshTokenSchema = new mongoose.Schema({

    value: {
        type: String,
        required: true,
        unique: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
