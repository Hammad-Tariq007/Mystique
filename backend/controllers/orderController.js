import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from 'stripe'

//global variables
const currency = 'usd'
const deliveryCharge = 10

//Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Placing orders using COD method
const placeOrder = async  (req,res) => {

    try {
        const { userId, items, amount, address } = req.body;

        // Validate stock before placing order
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.json({ success: false, message: `Product not found for ID: ${item._id}` });
            }
            if (product.stock < item.quantity) {
                return res.json({ success: false, message: `Insufficient stock for ${product.name}. Only ${product.stock} left.` });
            }
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        
        // Decrease stock for each item in the order atomically
        for (const item of items) {
            await productModel.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
        }

        //clear the cart
        await userModel.findByIdAndUpdate(userId,{cartData: {}})

        res.json({
            success: true,
            message: 'Order placed'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


//Placing orders using Stripe method
const placeOrderStripe = async  (req,res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        // Validate stock before initiating Stripe payment
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (!product) {
                return res.json({ success: false, message: `Product not found for ID: ${item._id}` });
            }
            if (product.stock < item.quantity) {
                return res.json({ success: false, message: `Insufficient stock for ${product.name}. Only ${product.stock} left.` });
            }
        }

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item)=> ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery fee",
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1,      
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({
            success: true,
            session_url: session.url
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//verify Stripe
const verifyStripe = async (req,res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === 'true') {
            //update status and clear the cart
            const order = await orderModel.findByIdAndUpdate(orderId,{payment: true});
            if (order) {
                // Decrease stock for each item in the order atomically only on successful payment
                for (const item of order.items) {
                    await productModel.findByIdAndUpdate(item._id, { $inc: { stock: -item.quantity } });
                }
            }
            await userModel.findByIdAndUpdate(userId,{cartData: {}});
            res.json({
                success: true
            })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({
                success: false
            })
        }

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

//All orders data for Admin panel
const allOrders = async  (req,res) => {
    try {
        
        const orders = await orderModel.find({})
        res.json({ success:true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false ,message: error.message })
    }
}

//User order data for frontend
const userOrders = async  (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({userId})
        res.json({success: true, orders})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

//Update Order Status from Admin panel
const updateStatus = async  (req,res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success: true, message: 'Status updated'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})  
    }
}

export { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe }