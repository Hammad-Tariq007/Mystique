import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'

const CATEGORY_ENUM = ["Clothing", "Accessories", "Footwear"];
const SUBCATEGORY_ENUM = ["Dresses", "Tops", "Bottoms", "Outerwear", "Jewelry", "Bags"];

// function for add products
const addProduct = async (req,res) => {
    try {
        const {
            name, 
            description,
            price,
            category,
            subcategory,
            sizes,
            stock,
            bestseller,
            newArrival,
            limitedEdition
        } = req.body;

        // Validate category and subcategory
        if (!CATEGORY_ENUM.includes(category)) {
            return res.json({ success: false, message: "Invalid category." });
        }
        if (!SUBCATEGORY_ENUM.includes(subcategory)) {
            return res.json({ success: false, message: "Invalid subcategory." });
        }

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
        const imagesUrl = await Promise.all(
            images.map( async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'})
                return result.secure_url
            })
        )
        
        const productData = { 
            name, 
            description,
            price: Number(price), 
            category, 
            subcategory, 
            sizes: JSON.parse(sizes), 
            stock: Number(stock),
            bestseller: bestseller === "true" || bestseller === true,
            newArrival: newArrival === "true" || newArrival === true,
            limitedEdition: limitedEdition === "true" || limitedEdition === true,
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()
        res.json({
            success: true,
            message: "Product Added"
        })

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for list products
const listProducts = async (req,res) => {
    try { 
        console.log('Attempting to fetch all products...');
        const products = await productModel.find({});
        console.log('Number of products found:', products.length);
        console.log('First few products:', products.slice(0, 3));
        
        res.json({
            success: true,
            products
        })
    } catch (error) {
        console.log('Error in listProducts:', error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// function for removing product
const removeProduct = async (req,res) => {
    try {
        
        const remove = await productModel.findByIdAndDelete(req.body.id)
        if (!remove) {
          return res.json({
            success: false,
            message: "Could not find a product to delete!"
          })
        }
        res.json({
            success: true,
            message: "Product Deleted"
        })

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// function for single product info by ID
const getProductById = async (req,res) => {
    try {
        const { id } = req.params;
        console.log('Fetching product with ID:', id);
        
        const product = await productModel.findById(id);
        console.log('Product found:', product);
        
        if (!product) {
            console.log('No product found with ID:', id);
            return res.json({ success: false, message: "Product not found." });
        }
        res.json({
            success: true,
            product
        })
    } catch (error) {
        console.log('Error in getProductById:', error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, subcategory, sizes, stock, bestseller, newArrival, limitedEdition } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found." });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = Number(price);
        if (category) {
            if (!CATEGORY_ENUM.includes(category)) {
                return res.json({ success: false, message: "Invalid category." });
            }
            product.category = category;
        }
        if (subcategory) {
            if (!SUBCATEGORY_ENUM.includes(subcategory)) {
                return res.json({ success: false, message: "Invalid subcategory." });
            }
            product.subcategory = subcategory;
        }
        if (sizes) product.sizes = JSON.parse(sizes);
        if (stock !== undefined) product.stock = Number(stock);
        if (bestseller !== undefined) product.bestseller = bestseller === "true" || bestseller === true;
        if (newArrival !== undefined) product.newArrival = newArrival === "true" || newArrival === true;
        if (limitedEdition !== undefined) product.limitedEdition = limitedEdition === "true" || limitedEdition === true;

        // Handle image updates if necessary (similar to addProduct, but more complex for partial updates)
        // For now, assuming images are not updated via this route or are handled separately.

        await product.save();

        res.json({
            success: true,
            message: "Product Updated",
            product
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, removeProduct, getProductById, updateProduct }