import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from "sonner"
import { Trash2, AlertCircle, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


const List = ({token}) => {

  const [list, setList] = useState([])
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers: {token}})

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    fetchList()
  },[])


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100 px-4 py-10 transition-all">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col gap-8 animate-fade-up">
        {/* Editorial Header */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-1 tracking-tight">Product List</h1>
          <div className="w-16 h-1 bg-pink-200 rounded-full mb-2" />
          <p className="text-sm text-gray-500 font-sans">Manage your collection below.</p>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-base font-medium font-sans text-gray-700">All Products</p>
          <p className="text-sm font-sans text-gray-400 mr-2">Total: {list.length}</p>
        </div>
        <div className="flex flex-col gap-2">
          {/* Table Header */}
          <div className="hidden md:grid h-14 grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2fr] items-center px-4 bg-pink-50 text-sm font-semibold font-serif rounded-xl border border-gray-100 shadow-sm">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span className="text-right">Price</span>
            <span className="text-right">Stock</span>
            <span className='text-center'>Actions</span>
          </div>
          {/* Product List */}
          {list.length === 0 && (
            <div className="w-full text-center text-gray-400 py-12 font-sans text-lg">No products found.</div>
          )}
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2fr] md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_2fr] items-center gap-2 py-4 px-4 border border-gray-100 bg-white/80 rounded-xl shadow-sm text-sm font-sans transition hover:shadow-md hover:bg-pink-50/60"
              key={index}
            >
              <img
                alt={item.name}
                src={item.image[0]}
                className="w-16 h-16 object-cover rounded-xl shadow-md border border-gray-100 bg-gray-50"
              />
              <p className="font-medium text-gray-800 truncate pr-2">{item.name}</p>
              <p className="text-gray-500">{item.category}</p>
              <p className="text-gray-700 font-semibold text-right">{currency}{item.price}</p>
              <div className="flex items-center gap-1 justify-end">
                {item.stock <= 3 && item.stock > 0 && (
                  <span className="inline-flex items-center gap-1 text-yellow-800 text-xs font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    Only {item.stock} left!
                  </span>
                )}
                {item.stock > 3 && item.stock}
                {item.stock === 0 && (
                    <span className="inline-flex items-center gap-1 text-red-700 text-xs font-semibold">
                    <AlertCircle className="w-3 h-3" />
                    Out of Stock
                    </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  className="flex items-center justify-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-100 hover:text-blue-800 rounded-full px-4 py-2 font-medium transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  onClick={() => navigate(`/edit/${item._id}`)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  className="flex items-center justify-center gap-2 border border-pink-200 text-pink-600 hover:bg-pink-100 hover:text-pink-800 rounded-full px-4 py-2 font-medium transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                  onClick={() => removeProduct(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default List