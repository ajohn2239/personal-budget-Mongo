const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        // 6-digit hexadecimal color
        match: /^#[0-9A-Fa-f]{6}$/ 
    }
});


const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
