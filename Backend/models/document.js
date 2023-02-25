const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/*
Document: {
    patient: Patient,
    date: Date,
    description: String,
    type: String,
    data: String
}
*/

let documentSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: null
    },
    type: {
        type: String,
        required: true,
        enum: ['pdf', 'image', 'text', 'other']
    },
    data: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Document', documentSchema);