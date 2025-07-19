import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/context/ShopContext'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CollectionSkeleton } from '@/features/collection/CollectionSkeleton'
import { Link } from 'react-router-dom'

const categories = ["Clothing", "Accessories", "Footwear"]
const subcategories = ["Dresses", "Tops", "Bottoms", "Outerwear", "Jewelry", "Bags"]

const Collection = () => {
  const { products, search, showSearch, isLoading } = useContext(ShopContext)

  // State for filters
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [bestsellerOnly, setBestsellerOnly] = useState(false)
  const [newArrivalOnly, setNewArrivalOnly] = useState(false)
  const [limitedEditionOnly, setLimitedEditionOnly] = useState(false)

  // Toggle category filter
  const toggleCategory = (value) => {
    setCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  // Toggle subcategory filter
  const toggleSubCategory = (value) => {
    setSubCategory(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
  }

  // Apply filters to products
  const applyFilter = () => {
    let filtered = products;

    // Search filter
    if (showSearch && search) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    // Category filter
    if (category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category))
    }

    // Subcategory filter
    if (subCategory.length > 0) {
      filtered = filtered.filter(item => subCategory.includes(item.subcategory))
    }

    // Extras filters
    if (bestsellerOnly) {
      filtered = filtered.filter(item => item.bestseller)
    }
    if (newArrivalOnly) {
      filtered = filtered.filter(item => item.newArrival)
    }
    if (limitedEditionOnly) {
      filtered = filtered.filter(item => item.limitedEdition)
    }

    setFilterProducts(filtered)
  }

  // Sort products
  const sortProduct = () => {
    let sorted = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter(); // Reset filter if "relevant"
        return;
    }

    setFilterProducts(sorted);
  }

  // Run filter logic when dependencies change
  useEffect(() => {
    applyFilter()
  }, [category, subCategory, search, showSearch, products, bestsellerOnly, newArrivalOnly, limitedEditionOnly])

  useEffect(() => {
    sortProduct()
  }, [sortType])

  return (
    <div className="w-screen bg-white dark:bg-black px-6 sm:px-16 xl:px-32 py-32 text-charcoal dark:text-white space-y-24">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto animate-fade-up">
        <h1 className="text-5xl sm:text-6xl font-serif font-semibold mb-4 tracking-tight">All Collections</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tailored silhouettes. Curated forms. Designed for movement and minimalism.</p>
      </div>
      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 animate-fade-up delay-100">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-transparent text-xs font-semibold tracking-widest uppercase font-serif hover:bg-gold/10 hover:text-gold transition-all duration-200 focus:outline-none"
          style={{ letterSpacing: '0.15em' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-gold transition-colors duration-200"
            aria-hidden="true"
          >
            <line x1="4" y1="7" x2="20" y2="7" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="7" r="2" strokeWidth="2" />
            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="12" r="2" strokeWidth="2" />
            <line x1="4" y1="17" x2="20" y2="17" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="2" strokeWidth="2" />
          </svg>
          Filters
        </button>
        <Select defaultValue="relevant" onValueChange={setSortType}>
          <SelectTrigger className="w-[180px] border border-gray-300 text-sm bg-white dark:bg-neutral-900">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevant">Relevant</SelectItem>
            <SelectItem value="low-high">Price: Low to High</SelectItem>
            <SelectItem value="high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Filters (If Visible) */}
      {showFilter && (
        <div className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 px-8 py-10 animate-fade-up animate-scale-up flex flex-col gap-10 mt-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Category */}
            <div>
              <h4 className="mb-6 uppercase font-serif font-semibold tracking-widest text-xs text-gold">Category</h4>
              <div className="flex flex-col gap-4">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-4 cursor-pointer group text-base font-medium text-charcoal dark:text-white">
                    <Checkbox id={cat} checked={category.includes(cat)} onCheckedChange={() => toggleCategory(cat)}
                      className="w-5 h-5 rounded-full border-2 border-gold group-hover:border-charcoal dark:group-hover:border-white checked:bg-gold checked:border-gold transition-all duration-200" />
                    <span className="font-sans text-base">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Subcategory */}
            <div>
              <h4 className="mb-6 uppercase font-serif font-semibold tracking-widest text-xs text-gold">Subcategory</h4>
              <div className="flex flex-col gap-4">
                {subcategories.map(sub => (
                  <label key={sub} className="flex items-center gap-4 cursor-pointer group text-base font-medium text-charcoal dark:text-white">
                    <Checkbox id={sub} checked={subCategory.includes(sub)} onCheckedChange={() => toggleSubCategory(sub)}
                      className="w-5 h-5 rounded-full border-2 border-gold group-hover:border-charcoal dark:group-hover:border-white checked:bg-gold checked:border-gold transition-all duration-200" />
                    <span className="font-sans text-base">{sub}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Extras */}
            <div>
              <h4 className="mb-6 uppercase font-serif font-semibold tracking-widest text-xs text-gold">Extras</h4>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-4 cursor-pointer group text-base font-medium text-charcoal dark:text-white">
                  <Checkbox id="bestseller" checked={bestsellerOnly} onCheckedChange={() => setBestsellerOnly(!bestsellerOnly)}
                    className="w-5 h-5 rounded-full border-2 border-gold group-hover:border-charcoal dark:group-hover:border-white checked:bg-gold checked:border-gold transition-all duration-200" />
                  <span className="font-sans text-base">Bestsellers Only</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group text-base font-medium text-charcoal dark:text-white">
                  <Checkbox id="newArrival" checked={newArrivalOnly} onCheckedChange={() => setNewArrivalOnly(!newArrivalOnly)}
                    className="w-5 h-5 rounded-full border-2 border-gold group-hover:border-charcoal dark:group-hover:border-white checked:bg-gold checked:border-gold transition-all duration-200" />
                  <span className="font-sans text-base">New Arrivals Only</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group text-base font-medium text-charcoal dark:text-white">
                  <Checkbox id="limitedEdition" checked={limitedEditionOnly} onCheckedChange={() => setLimitedEditionOnly(!limitedEditionOnly)}
                    className="w-5 h-5 rounded-full border-2 border-gold group-hover:border-charcoal dark:group-hover:border-white checked:bg-gold checked:border-gold transition-all duration-200" />
                  <span className="font-sans text-base">Limited Edition Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Product Grid */}
      {isLoading ? <CollectionSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 animate-fade-up delay-300">
          {filterProducts.map(product => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="pt-4 px-2">
                <h3 className="text-md font-serif font-medium text-charcoal dark:text-white">{product.name}</h3>
                <p className="text-sm font-medium text-gold mt-1">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {/* Empty State */}
      {!isLoading && !filterProducts.length && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-20 text-sm italic">No matching products found.</p>
      )}
    </div>
  )
}

export default Collection
