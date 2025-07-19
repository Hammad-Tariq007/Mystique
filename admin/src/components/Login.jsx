import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from "sonner"

const Login = ({setToken}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(backendUrl + '/api/user/admin', {email, password})
            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message)
            }     
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-purple-100 min-h-screen flex justify-center items-center transition-all">
        <form
            onSubmit={onSubmitHandler}
            className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-up transition-all"
        >
            <h1 className="text-4xl font-serif text-center font-semibold text-gray-800 mb-3">Mystique Admin</h1>
            <p className="text-sm text-center text-gray-500 mb-6">Access your dashboard</p>
            <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                autoFocus
                disabled={loading}
            />
            <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
                disabled={loading}
            />
            <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-full text-sm tracking-wide hover:bg-neutral-900 transition"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    </div>
  )
}

export default Login