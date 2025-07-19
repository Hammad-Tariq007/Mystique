import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/context/ShopContext'
import { assets } from '@/assets/assets'
import CartTotal from '@/features/shared/CartTotal'
import { Link } from 'react-router-dom'
import NumberFlow from '@number-flow/react'
import { X, Trash2 } from 'lucide-react'
import { toast } from "sonner"

const Cart = () => {
  const { products, cartItems, updateQuantity, navigate, resetCart } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const sizes in cartItems[items]) {
          if (cartItems[items][sizes] > 0) {
            tempData.push({
              id: items,
              size: sizes,
              quantity: cartItems[items][sizes]
            })
          }
        }
      }
      setCartData(tempData)
    }
  }, [cartItems, products])

  if (cartData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 sm:px-12 lg:px-32 py-24 animate-fade-up">
        <img src={assets.cart} alt="Empty cart" className="w-28 h-28 mb-8 opacity-70" />
        <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-4 text-center">Your cart is empty — but not for long.</h2>
        <Link to="/collection" className="mt-2 px-8 py-3 bg-black text-white rounded-xl uppercase tracking-wider font-medium hover:bg-gold hover:text-black transition-all duration-300 text-sm shadow-md">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-[80vh] bg-offwhite dark:bg-black px-6 sm:px-12 lg:px-32 py-24 animate-fade-up">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Product List */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold mb-8 tracking-tight">Your Cart</h1>
          {cartData.map((item, idx) => {
            const productData = products.find((product) => product._id === item.id)
            if (!productData) return null;
            return (
              <div key={idx} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6 animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
                {/* Product Image */}
                <img className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shadow-lg" src={productData.image[0]} alt={productData.name} />
                {/* Product Info */}
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg sm:text-xl font-serif font-semibold text-charcoal dark:text-offwhite truncate">{productData.name}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, 0)} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 text-gray-400 hover:text-gold">
                      <X size={22} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="px-3 py-1 rounded-full bg-peach text-charcoal text-xs font-medium uppercase tracking-wider border border-gold/20">{item.size}</span>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 ml-2">
                      <button onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-full border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-xl font-semibold text-charcoal dark:text-offwhite bg-offwhite dark:bg-neutral-800 hover:bg-gold hover:text-black transition-all">-</button>
                      <span className="w-8 text-center font-medium text-base">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-xl font-semibold text-charcoal dark:text-offwhite bg-offwhite dark:bg-neutral-800 hover:bg-gold hover:text-black transition-all">+</button>
                    </div>
                  </div>
                </div>
                {/* Price */}
                <div className="flex flex-col items-end min-w-[90px]">
                  <span className="text-xl font-medium text-gold font-serif">$
                    {Number(productData.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )
          })}
          {/* Empty Cart Button */}
          {cartData.length > 0 && (
            <button
              className="flex items-center justify-center gap-2 mt-6 w-full sm:w-fit self-end text-sm sm:text-base px-6 py-3 rounded-full bg-red-50 text-red-600 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors animate-fade-in"
              onClick={() => {
                toast.warning("Are you sure you want to empty your cart?", {
                  action: {
                    label: "Confirm",
                    onClick: () => resetCart(),
                  },
                  cancel: {
                    label: "Cancel",
                    onClick: () => toast.dismiss(),
                  },
                });
              }}
            >
              <Trash2 className="w-5 h-5" />
              Empty Cart
            </button>
          )}
        </div>
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 mb-8 animate-fade-up">
              <h2 className="text-xl font-serif font-semibold mb-6 tracking-tight">Order Summary</h2>
              <CartTotal />
              <button onClick={() => navigate('/place-order')} className="w-full mt-8 py-4 rounded-xl bg-black text-white font-serif font-semibold text-base uppercase tracking-wider hover:bg-gold hover:text-black transition-all duration-300 shadow-md">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart