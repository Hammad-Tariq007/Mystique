import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: {
        type: String,
        required: true,
        enum: ["Clothing", "Accessories", "Footwear"],
    },
    subcategory: {
        type: String,
        required: true,
        enum: ["Dresses", "Tops", "Bottoms", "Outerwear", "Jewelry", "Bags"],
    },
    sizes: { type: Array, required: true },
    stock: { type: Number, required: true, default: 0 },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    limitedEdition: { type: Boolean, default: false },
    date: { type: Number, required: true },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel