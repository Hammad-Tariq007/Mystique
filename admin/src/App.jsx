import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Edit from './pages/Edit'
import { Toaster } from '@/components/ui/sonner'
import NotFound from './components/NotFound'

export const backendUrl = 'http://localhost:4000'
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  )

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Toaster richColors closeButton />
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar onLogout={() => setToken('')} />
            <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/reports' element={<Reports token={token} />} />
                <Route path='/edit/:id' element={<Edit token={token} />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
