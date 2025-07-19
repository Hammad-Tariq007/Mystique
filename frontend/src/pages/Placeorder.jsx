import React, { useContext, useState } from 'react'
import Title from '@/components/Title'
import CartTotal from '@/features/shared/CartTotal'
import { assets } from '@/assets/assets'
import { ShopContext } from '@/context/ShopContext'
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Info } from 'lucide-react'

const Placeorder = () => {
  const orderSchema = z.object({
    firstName: z.string()
      .min(2, { message: "First name must be at least 2 characters." })
      .regex(/^[A-Za-z\s-]+$/, { message: "First name can only contain letters, spaces, and hyphens." }),
    lastName: z.string()
      .min(2, { message: "Last name must be at least 2 characters." })
      .regex(/^[A-Za-z\s-]+$/, { message: "Last name can only contain letters, spaces, and hyphens." }),
    email: z.string()
      .email({ message: "Invalid email address." })
      .min(5, { message: "Email must be at least 5 characters." }),
    street: z.string()
      .min(3, { message: "Street address must be at least 3 characters." })
      .regex(/^[A-Za-z0-9\s,-.]+$/, { message: "Street address can only contain letters, numbers, spaces, commas, and periods." }),
    city: z.string()
      .min(2, { message: "City must be at least 2 characters." })
      .regex(/^[A-Za-z\s-]+$/, { message: "City can only contain letters, spaces, and hyphens." }),
    state: z.string()
      .min(2, { message: "State must be at least 2 characters." })
      .regex(/^[A-Za-z\s-]+$/, { message: "State can only contain letters, spaces, and hyphens." }),
    zipcode: z.string()
      .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid Zip Code format (e.g., 12345 or 12345-6789)." }),
    country: z.string()
      .min(2, { message: "Country must be at least 2 characters." })
      .regex(/^[A-Za-z\s-]+$/, { message: "Country can only contain letters, spaces, and hyphens." }),
    phone: z.string()
      .regex(/^\+?\d{10,15}$/, { message: "Phone number must be 10-15 digits and can start with '+'." }),
    note: z.string().optional(),
  })

  const [method, setMethod] = useState('cod')
  const [billingSame, setBillingSame] = useState(true)
  const [loading, setLoading] = useState(false)
  const { navigate, backendUrl, token, cartItems, resetCart, getCartAmount, deliveryFee, products } = useContext(ShopContext)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      phone: '',
      note: ''
    }
  })

  // Prepare mutation for COD
  const placeOrderMutation = useMutation({
    mutationFn: (orderData) =>
      axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } }),
    onSuccess: (res) => {
      setLoading(false)
      if (res.data.success) {
        toast.success('Order successfully placed!')
        resetCart()
        navigate('/orders')
      } else {
        toast.error(res.data.message)
      }
    },
    onError: (error) => {
      setLoading(false)
      toast.error(error.message)
    },
  })

  // Prepare mutation for Stripe
  const stripeOrderMutation = useMutation({
    mutationFn: (orderData) =>
      axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } }),
    onSuccess: (res) => {
      setLoading(false)
      if (res.data.success) {
        toast.success('Redirecting to Stripe...')
        window.location.replace(res.data.session_url)
      } else {
        toast.error(res.data.message)
      }
    },
    onError: (error) => {
      setLoading(false)
      toast.error(error.message)
    },
  })

  // Collect data from cart + form and submit
  const onSubmitHandler = async (data) => {
    try {
      setLoading(true)
      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              // Final stock validation before placing order
              if (itemInfo.stock < cartItems[items][item]) {
                  toast.error(`Insufficient stock for ${itemInfo.name}. Only ${itemInfo.stock} left.`);
                  setLoading(false);
                  return;
              }

              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty. Please add items to your cart.");
        setLoading(false);
        return;
      }

      const orderData = {
        address: data,
        items: orderItems,
        amount: getCartAmount() + deliveryFee
      }
      switch (method) {
        case 'cod':
          placeOrderMutation.mutate(orderData)
          break
        case 'stripe':
          stripeOrderMutation.mutate(orderData)
          break
        default:
          setLoading(false)
          break
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}
      className="w-full min-h-screen py-24 px-6 sm:px-12 lg:px-32 bg-offwhite dark:bg-black animate-fade animate-duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: Delivery Form */}
        <div className="flex flex-col items-center lg:items-start animate-fade-up delay-100">
          <div className="w-full max-w-xl bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-offwhite mb-2">Delivery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Controller name='firstName' control={control} render={({ field }) => (
                  <Input className={`h-12 rounded-xl px-4 w-full ${errors.firstName ? 'border-red-400' : ''}`} placeholder='First Name' {...field} />
            )} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.firstName.message}</p>}
          </div>
          <div>
            <Controller name='lastName' control={control} render={({ field }) => (
                  <Input className={`h-12 rounded-xl px-4 w-full ${errors.lastName ? 'border-red-400' : ''}`} placeholder='Last Name' {...field} />
            )} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <Controller name='email' control={control} render={({ field }) => (
                <Input className={`h-12 rounded-xl px-4 w-full ${errors.email ? 'border-red-400' : ''}`} type='email' placeholder='Email address' {...field} />
          )} />
              {errors.email && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.email.message}</p>}
        </div>
        <div>
          <Controller name='street' control={control} render={({ field }) => (
                <Input className={`h-12 rounded-xl px-4 w-full ${errors.street ? 'border-red-400' : ''}`} placeholder='Street' {...field} />
          )} />
              {errors.street && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.street.message}</p>}
        </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Controller name='city' control={control} render={({ field }) => (
                  <Input className={`h-12 rounded-xl px-4 w-full ${errors.city ? 'border-red-400' : ''}`} placeholder='City' {...field} />
            )} />
                {errors.city && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.city.message}</p>}
          </div>
          <div>
            <Controller name='state' control={control} render={({ field }) => (
                  <Input className={`h-12 rounded-xl px-4 w-full ${errors.state ? 'border-red-400' : ''}`} placeholder='State/Province' {...field} />
            )} />
                {errors.state && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.state.message}</p>}
          </div>
        </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Controller name='zipcode' control={control} render={({ field }) => (
                  <Input className={`h-12 rounded-xl px-4 w-full ${errors.zipcode ? 'border-red-400' : ''}`} placeholder='Zipcode' type='number' {...field} />
            )} />
                {errors.zipcode && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.zipcode.message}</p>}
          </div>
          <div>
            <Controller name='country' control={control} render={({ field }) => (
                  <Input className={`h-12 rounded-xl px-4 w-full ${errors.country ? 'border-red-400' : ''}`} placeholder='Country' {...field} />
            )} />
                {errors.country && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.country.message}</p>}
          </div>
        </div>
        <div>
          <Controller name='phone' control={control} render={({ field }) => (
                <Input className={`h-12 rounded-xl px-4 w-full ${errors.phone ? 'border-red-400' : ''}`} placeholder='Phone Number' type='tel' {...field} />
          )} />
              {errors.phone && <p className="text-red-500 text-xs mt-1 animate-fade-up">{errors.phone.message}</p>}
        </div>
            {/* Optional Note */}
      <div>
              <Controller name='note' control={control} render={({ field }) => (
                <Input className="h-12 rounded-xl px-4 w-full" placeholder='Add a note (optional)' {...field} />
              )} />
        </div>
            {/* Billing address toggle */}
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={billingSame} onChange={() => setBillingSame(!billingSame)} id="billing-toggle" className="accent-gold w-4 h-4 rounded" />
              <label htmlFor="billing-toggle" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">Billing address same as delivery</label>
            </div>
          </div>
        </div>
        {/* RIGHT: Cart Summary + Payment */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-24 animate-fade-up delay-200">
          {/* Cart Summary Card */}
          <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-8 min-w-[320px]">
            <h3 className="text-xl font-serif font-semibold mb-6 text-gray-800 dark:text-offwhite">Order Summary</h3>
            <CartTotal />
            <div className="border-t border-gray-200 my-4"></div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Final Total</span>
              <span className="text-xl font-semibold text-gold">${getCartAmount() + deliveryFee}</span>
            </div>
          </div>
          {/* Payment Method Card */}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl px-6 py-5 shadow border">
            <h4 className="text-lg font-serif font-semibold mb-4 text-gray-800 dark:text-offwhite flex items-center gap-2">Payment Method <Info className="w-4 h-4 text-gold" title="All payments are secure" /></h4>
            <div className="flex flex-col gap-4">
              {/* Stripe Option */}
              <div
                onClick={() => {
                  setMethod('stripe')
                  toast.info('For mock payment please enter: any valid date and card number 4242 4242 4242 4242')
                }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${method === 'stripe' ? 'border-gold bg-peach/50' : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-gold/50 dark:hover:border-gold/50'}`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" className="form-radio text-gold w-4 h-4 accent-gold" checked={method === 'stripe'} onChange={() => setMethod('stripe')} />
                  <span className="text-base font-medium text-gray-800 dark:text-offwhite">Credit/Debit Card (Stripe)</span>
                </div>
              </div>
              {/* COD Option */}
              <div
                onClick={() => setMethod('cod')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${method === 'cod' ? 'border-gold bg-peach/50' : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-gold/50 dark:hover:border-gold/50'}`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" name="paymentMethod" className="form-radio text-gold w-4 h-4 accent-gold" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                  <span className="text-base font-medium text-gray-800 dark:text-offwhite">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Button */}
          <button
            type="submit"
            className={`w-full rounded-xl py-3 mt-8 font-sans font-semibold text-lg uppercase transition-all duration-300 bg-black text-white hover:bg-gold hover:text-black flex items-center justify-center gap-2
              ${(loading || !isValid) ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading || !isValid}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : null}
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Placeorder
