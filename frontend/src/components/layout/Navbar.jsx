import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '@/context/ShopContext'
import { toast } from 'sonner'

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { getCartCount, isCartLoading, navigate, token, setToken } = React.useContext(ShopContext)
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0);
  const [bump, setBump] = useState(false);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY) {
        setIsVisible(false) // Scrolling down
      } else {
        setIsVisible(true) // Scrolling up
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const count = getCartCount();
    setBump(true);
    setCartCount(count);
    const timer = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(timer);
  }, [getCartCount()]);

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')  
    toast.success("Successfully logged out") 
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        bg-white/90 dark:bg-charcoal/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800
        ${lastScrollY > 20 ? 'shadow-lg' : ''}`}
    >
      <div className="max-w-[2000px] mx-auto">
        <div className="flex justify-between items-center w-full h-[90px] px-6 sm:px-8 lg:px-12">
          {/* Brand Block */}
          <Link to="/" className="group">
            <span className="text-3xl sm:text-4xl font-heading font-semibold text-charcoal dark:text-white tracking-tight transition-all duration-300 group-hover:text-gold dark:group-hover:text-gold">
              Mystique
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Collection', 'About', 'Contact', token && 'Orders'].filter(Boolean).map((item) => (
              <NavLink
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={({ isActive }) => `
                  text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300
                  ${isActive 
                    ? 'text-charcoal dark:text-white' 
                    : 'text-gray-400 hover:text-charcoal dark:text-gray-400 dark:hover:text-white'
                  }
                  relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px]
                  after:bg-charcoal dark:after:bg-white after:transition-all after:duration-300
                  hover:after:w-full
                `}
              >
                {item}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-8">
            {/* Cart */}
            <button 
              onClick={() => token ? navigate('/cart') : navigate('/login')} 
              className="relative transition-all duration-300 hover:scale-110"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-charcoal dark:text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              <span className={`absolute -top-2 -right-2 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${bump ? 'animate-bounce scale-110' : ''}`}
                style={{ opacity: isCartLoading ? 0.6 : 1 }}>
                {isCartLoading ? (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" /></svg>
                ) : (
                  cartCount
                )}
              </span>
            </button>

            {/* Auth Section */}
            {token ? (
              <div className="flex items-center gap-6">
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="text-sm uppercase text-gray-500 hover:text-charcoal dark:text-gray-300 dark:hover:text-white transition bg-transparent border-none outline-none px-0 py-0"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm uppercase text-gray-500 hover:text-charcoal dark:text-gray-300 dark:hover:text-white transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-charcoal dark:text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          fixed inset-0 bg-white dark:bg-charcoal z-50
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
          md:hidden
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="text-2xl font-heading font-semibold text-charcoal dark:text-white">
              Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-charcoal dark:text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col p-6 space-y-6">
            {['Home', 'Collection', 'About', 'Contact', token && 'Orders'].filter(Boolean).map((item, index) => (
              <NavLink
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  text-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'text-charcoal dark:text-white' 
                    : 'text-gray-400 hover:text-charcoal dark:text-gray-400 dark:hover:text-white'
                  }
                  animate-fadeUp
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar