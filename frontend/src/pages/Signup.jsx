import React, { useContext, useEffect, useState } from 'react'
import { assets } from '@/assets/assets';
import { ShopContext } from '@/context/ShopContext'
import axios from 'axios';
import { toast } from "sonner"
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"

const signupSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .regex(/^[A-Za-z\s-]+$/, { message: "Name can only contain letters, spaces, and hyphens" }),
  email: z.string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, digit, and special character"
    })
})

const Signup = () => {

  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // React Query Mutation for Signup
  const signupMutation = useMutation({
    mutationFn: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay of 1 second
      const response = await axios.post(`${backendUrl}/api/user/register`, values)
      console.log(response.data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        navigate('/')
        toast.success("Registered successfully!")
        reset()
      } else {
        toast.error(data.message)
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Login failed, try again later"
      toast.error(errorMessage)
    }
  })

  const onSubmit = (values) => {
    signupMutation.mutate(values)
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  const password = watch('password') || '';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-offwhite via-white to-peach-50 dark:from-neutral-900 dark:via-black dark:to-neutral-950 relative">
      {/* Logo (absolute, top-left) */}
      <span className="absolute top-8 left-8 z-20 text-xl font-serif font-bold tracking-tight text-gold select-none">Mystique.</span>
      {/* Back to Home Button (top right, absolute) */}
      <div className="absolute top-8 right-8 z-20 animate-fade-up delay-700">
        <Link to="/" className="inline-block px-6 py-3 rounded-full bg-gold/90 text-white font-serif font-semibold tracking-tight shadow-lg hover:bg-gold transition-all text-base">← Back to Home</Link>
      </div>
      {/* Centered Card */}
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl bg-white/95 dark:bg-neutral-900/95 px-8 py-12 flex flex-col gap-8 items-center animate-fade-in-scale">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-black dark:text-white mb-2 animate-fade-up">Create an Account</h1>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-6 animate-fade-up delay-100">Sign up to start your Mystique journey.</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full flex flex-col gap-6">
          {/* Name Input */}
          <div className="flex flex-col gap-1 animate-fade-up delay-150">
            <label htmlFor="name" className="text-xs tracking-wider uppercase text-gray-500 mb-1 font-medium">Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z"/></svg>
              </span>
              <Controller
                name="name"
                control={control}
                render={({ field, ref }) => (
                  <input
                    {...field}
                    ref={ref}
                    id="name"
                    type="text"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 focus:border-gold focus:ring-2 focus:ring-gold/20 text-base font-sans outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                )}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs ml-1 mt-1">{errors.name.message}</p>}
          </div>
          {/* Email Input */}
          <div className="flex flex-col gap-1 animate-fade-up delay-200">
            <label htmlFor="email" className="text-xs tracking-wider uppercase text-gray-500 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75Zm0 0L12 13.5l9.75-6.75"/></svg>
              </span>
              <Controller
                name="email"
                control={control}
                render={({ field, ref }) => (
                  <input
                    {...field}
                    ref={ref}
                    id="email"
                    type="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 focus:border-gold focus:ring-2 focus:ring-gold/20 text-base font-sans outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                )}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs ml-1 mt-1">{errors.email.message}</p>}
          </div>
          {/* Password Input */}
          <div className="flex flex-col gap-1 animate-fade-up delay-300">
            <label htmlFor="password" className="text-xs tracking-wider uppercase text-gray-500 mb-1 font-medium">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16.5 10.5V7.5A4.5 4.5 0 0 0 7.5 7.5v3m9 0H7.5m9 0a2.25 2.25 0 0 1 2.25 2.25v3.75A2.25 2.25 0 0 1 16.5 18H7.5a2.25 2.25 0 0 1-2.25-2.25v-3.75A2.25 2.25 0 0 1 7.5 10.5m9 0H7.5"/></svg>
              </span>
              <Controller
                name="password"
                control={control}
                render={({ field, ref }) => (
                  <input
                    {...field}
                    ref={ref}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 focus:border-gold focus:ring-2 focus:ring-gold/20 text-base font-sans outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-all">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs ml-1 mt-1">{errors.password.message}</p>}
          </div>
          {/* Submit Button with Loading State */}
          <button
            type="submit"
            className={`w-full rounded-xl py-3 mt-2 font-sans font-semibold text-base uppercase transition-all duration-300 bg-black text-white hover:bg-gold hover:text-black flex items-center justify-center gap-2 animate-fade-up delay-500
              ${signupMutation.isPending ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : null}
            {signupMutation.isPending ? 'Creating user...' : 'Sign Up'}
          </button>
          {/* Login Link CTA */}
          <div className="w-full text-center mt-2 animate-fade-up delay-600">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Already have an account? </span>
            <Link to='/login' className="text-gold font-semibold hover:underline underline-offset-4 transition-all">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup