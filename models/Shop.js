import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    businessName: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    
    // Meta Cloud API Configuration Details
    whatsappPhoneNumberId: { 
        type: String, 
        unique: true, 
        sparse: true, // Allows null/absent values during initial registration
        trim: true
    },
    metaPermanentAccessToken: { 
        type: String, 
        default: null,
        trim: true
    },
    // Isolated Client-Billed AI Key
    clientGroqApiKey: { 
        type: String, 
        default: null,
        trim: true
    }
}, { timestamps: true });

export const Shop = mongoose.model('Shop', shopSchema);