const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    sender: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        dateOfBirth: {
            type: Date
        },
        idNumber: {
            type: String
        }
    },
    recipient: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        accountNumber: {
            type: String
        },
        bank: {
            type: String
        }
    },
    amount: {
        type: Number,
        required: true
    },
    currencyCd: {
        type: String,
        required: true
    },
    comments: { 
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('transaction', transactionSchema, 'transactions');