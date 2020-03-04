import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
    productType: { type: String, required: true, default: 'Product' },
    productTitle: { type: String, required: true, index: true},
    slug: { type: String },
    price: { type: Number, required: true, default: 0.00 },
    qty: { type: number, required: true, default: 0 },
    description: { type: String, required: true, index: true },
    productTags: [{ type: String, required: true, index: true }],
    originalPrice: { type: Number },
    productOptions: { type: Schema.Types.Mixed, default: {} },
    defaultImg: { type: String, default: 'img/default-img.jpg' },
    publish: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false }
},{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
