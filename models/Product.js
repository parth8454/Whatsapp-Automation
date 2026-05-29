import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    shopId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Shop', 
        required: true 
    },
    itemName: { 
        type: String, 
        required: true,
        trim: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

// Indexing shopId for rapid queries when webhooks fire under high message traffic
productSchema.index({ shopId: 1 });

export const Product = mongoose.model('Product', productSchema);