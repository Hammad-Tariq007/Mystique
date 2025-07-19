import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'sonner'
import { assets } from '../assets/assets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CheckCircle, Clock } from 'lucide-react'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (value, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: value },
        { headers: { token } }
      )

      if (response.data.success) {
        toast(response.data.message)
        fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100 px-4 py-10 transition-all">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col gap-8 animate-fade-up">
        {/* Editorial Header */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1 tracking-tight">Orders</h1>
          <div className="w-16 h-1 bg-pink-200 rounded-full mb-2" />
          <p className="text-sm text-gray-500 font-sans">Track and manage all customer orders.</p>
        </div>
        <div className="flex flex-col gap-6">
          {orders.length === 0 && (
            <div className="w-full text-center text-gray-400 py-12 font-sans text-lg">No orders found.</div>
          )}
          {orders.map((order, index) => (
            <div
              key={index}
              className="w-full bg-white/80 border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start"
            >
              {/* Parcel Icon */}
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-pink-50 shadow-sm border border-pink-100">
                <img src={assets.parcelIcon} alt='parcel-icon' className='w-8 h-8' />
              </div>
              {/* Order Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Items & Address */}
                <div>
                  <div className="mb-2">
                    {order.items.map((item, idx) => (
                      <p className="py-0.5 text-gray-700 font-sans text-sm" key={idx}>
                        <span className="font-medium text-gray-900">{item.name}</span> x {item.quantity} <span className="text-xs text-gray-400">{item.size}</span>{idx !== order.items.length - 1 ? ',' : ''}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 mb-1 font-serif text-base text-gray-800 font-semibold">{order.address.firstName + ' ' + order.address.lastName}</p>
                  <div className="text-gray-500 text-sm font-sans">
                    <p>{order.address.street + ','}</p>
                    <p>{order.address.city + ', ' + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{order.address.phone}</p>
                </div>
                {/* Order Meta */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700 font-sans">Items: <span className="font-medium">{order.items.length}</span></p>
                  <p className="text-sm text-gray-700 font-sans">Payment method: <span className="font-medium">{order.paymentMethod}</span></p>
                  <p className="text-sm text-gray-700 font-sans flex items-center gap-1">
                    Payment: {order.payment ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Done</span>
                    ) : (
                      <span className="text-gray-400 font-semibold flex items-center gap-1"><Clock className="w-4 h-4" /> Pending</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-700 font-sans">Date: <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span></p>
                  <p className="text-lg font-serif font-bold text-pink-700 mt-2">{currency}{order.amount}</p>
                  <div className="mt-2">
                    <Select
                      defaultValue={order.status}
                      value={order.status}
                      onValueChange={value => statusHandler(value, order._id)}
                      className='p-2 font-semibold'
                    >
                      <SelectTrigger className='w-[180px] rounded-lg border border-pink-200 bg-pink-50 shadow-sm focus:ring-2 focus:ring-pink-200 font-sans text-sm'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Order Placed'>Order placed</SelectItem>
                        <SelectItem value='Packing'>Packing</SelectItem>
                        <SelectItem value='Shipped'>Shipped</SelectItem>
                        <SelectItem value='Delivery in progress'>Delivery in progress</SelectItem>
                        <SelectItem value='Delivered'>Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
