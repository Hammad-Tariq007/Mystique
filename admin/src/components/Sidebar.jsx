import React from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut, LayoutDashboard, PlusSquare, List, ShoppingBag, BarChart2 } from 'lucide-react'

const navLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    to: '/add',
    label: 'Add Product',
    icon: <PlusSquare className="w-5 h-5" />,
  },
  {
    to: '/list',
    label: 'Product List',
    icon: <List className="w-5 h-5" />,
  },
  {
    to: '/orders',
    label: 'Orders',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    to: '/reports',
    label: 'Reports',
    icon: <BarChart2 className="w-5 h-5" />,
  },
  // Logout handled elsewhere if needed
]

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="w-[240px] min-h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out">
      {/* Top Branding */}
      <div>
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-2xl font-serif font-bold text-black tracking-tight">Mystique</h1>
          <div className="text-xs text-gray-400 font-light mt-1">Discover Your Signature Look</div>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 mt-8 px-6">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 text-base font-medium px-3 py-2 rounded-md font-sans transition-all duration-200
                ${isActive ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-500' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
          {/* Logout link/button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-base font-medium px-3 py-2 rounded-md font-sans text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-200 mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      {/* Bottom Section */}
      <div className="border-t border-gray-100 mt-10">
        <div className="text-xs text-gray-400 text-center py-4">© 2025 Glamify</div>
      </div>
    </aside>
  )
}

export default Sidebar