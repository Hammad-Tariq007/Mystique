import { createContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const ShopContext = createContext()

const ShopContextProvider = props => {
  const currency = '$'
  const deliveryFee = 10
  const backendUrl = 'https://mystique-api.onrender.com'
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Храним локальное состояние корзины
  const [cartItems, setCartItems] = useState({})

  // Get token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  // Load products list
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(`${backendUrl}/api/product/list`)
      return data.products
    }
  })

  // Load user cart if token exists
  const {
    data: cartData,
    isLoading: isCartLoading,
    refetch
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { token }
      })
      return data?.cartData || {}
    },
    enabled: !!token,
    onError: () => {
      toast.error('Failed to load cart.')
    }
  })

  // Refetch cart after login/logout
  useEffect(() => {
    if (token) {
      refetch().then(res => {
        setCartItems(res.data || {})
      })
    }
  }, [token, refetch])

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ itemId, size }) => {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { token } }
      )
    },
    onMutate: ({ itemId, size }) => {
      if (!size) {
        toast.error('Select Product Size')
        return
      }

      const product = products.find(p => p._id === itemId);
      if (!product) {
        toast.error('Product not found.');
        return;
      }

      const currentQuantityInCart = cartItems[itemId]?.[size] || 0;

      if (currentQuantityInCart + 1 > product.stock) {
        toast.error(`Only ${product.stock} items left in stock for ${product.name}.`);
        return;
      }

      const updatedCart = structuredClone(cartItems)
      if (!updatedCart[itemId]) updatedCart[itemId] = {}
      updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1
      setCartItems(updatedCart)
    },
    onError: error => toast.error(error.message),
    onSettled: () => {
      queryClient.invalidateQueries(['cart'])
    }
  })

  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size')
      return
    }
    addToCartMutation.mutate({ itemId, size })
  }

  // Update cart item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, size, quantity }) => {
      // Before sending update to backend, check stock
      const product = products.find(p => p._id === itemId);
      if (!product) {
        toast.error('Product not found.');
        throw new Error('Product not found.');
      }
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock for ${product.name}.`);
        throw new Error(`Only ${product.stock} items available in stock.`);
      }
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { token } }
      )
    },
    onMutate: ({ itemId, size, quantity }) => {
      const updatedCart = structuredClone(cartItems)

      if (!updatedCart[itemId]) updatedCart[itemId] = {}
      updatedCart[itemId][size] = quantity

      if (quantity === 0) {
        delete updatedCart[itemId][size]
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId]
        }
      }

      setCartItems(updatedCart)
    },
    onError: error => toast.error(error.message),
    onSettled: () => {
      queryClient.invalidateQueries(['cart'])
    }
  })

  const updateQuantity = (itemId, size, quantity) => {
    updateQuantityMutation.mutate({ itemId, size, quantity })
  }

  // Reset cart (e.g., after purchase)
  const resetCartMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`${backendUrl}/api/cart/reset`, {}, { headers: { token } })
    },
    onMutate: () => {
      setCartItems({})
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(['cart'])
      const { data } = await axios.get(`${backendUrl}/api/cart/get`, { headers: { token } })
      setCartItems(data?.cartData || {})
    },
    onError: error => toast.error(error.message)
  })

  const resetCart = () => {
    resetCartMutation.mutate()
  }

  // Get total item count in cart (sum of all units across all sizes)
  const getCartCount = () => {
    if (!cartItems || typeof cartItems !== 'object') return 0;
    let total = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] && typeof cartItems[itemId] === 'object') {
        for (const size in cartItems[itemId]) {
          const qty = cartItems[itemId][size];
          if (typeof qty === 'number' && qty > 0) total += qty;
        }
      }
    }
    return total;
  }

  // Get total price of items in cart
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
      const itemInfo = products.find(product => product._id === itemId)
      if (!itemInfo) return totalAmount
      return (
        totalAmount +
        Object.values(sizes).reduce((sum, qty) => sum + itemInfo.price * qty, 0)
      )
    }, 0)
  }

  // Always keep cartItems in sync after login, logout, or cart mutation
  useEffect(() => {
    refetch().then(res => {
      setCartItems(res.data || {})
    })
    // eslint-disable-next-line
  }, [token])

  // Expose cart loading state for Navbar
  const isCartLoadingState = isCartLoading;

  const value = {
    products,
    isLoading: isProductsLoading || isCartLoading,
    isCartLoading: isCartLoadingState,
    currency,
    deliveryFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    resetCart,
    navigate,
    backendUrl,
    token,
    setToken,
    refetch
  }

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  )
}

export default ShopContextProvider
