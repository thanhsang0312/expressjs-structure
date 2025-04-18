const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        required: false,
        trim: true
    },
    numberOfCourts: {
        type: Number,
        required: true,
        min: 1
    },
    courtType: {
        type: String,
        enum: ['badminton', 'pickleball'],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
}, {
    timestamps: true
});

// Single field indexes
courtSchema.index({ name: 1 }); // For searching by name
courtSchema.index({ courtType: 1 }); // For filtering by court type
courtSchema.index({ phone: 1 }, { unique: true }); // Ensure unique phone numbers

// Compound indexes
courtSchema.index({ name: 1, courtType: 1 }); // For searching name within a court type
courtSchema.index({ address: 'text', name: 'text' }); // For text search on address and name

// Geospatial index for location-based queries
courtSchema.index({ location: '2dsphere' });

const Court = mongoose.model('Court', courtSchema);

module.exports = Court;


