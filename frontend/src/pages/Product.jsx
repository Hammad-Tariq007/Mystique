import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '@/context/ShopContext'
import RelatedProducts from '@/features/product/RelatedProducts';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import NotFound from '@/components/NotFound';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Info, CheckCircle, AlertCircle } from 'lucide-react'

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, token, navigate, isLoading } = useContext(ShopContext)
  const [productData, setProductData] = useState()
  const [mainImage, setMainImage] = useState('')
  const [size, setSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)
  const [showGuide, setShowGuide] = useState(false)

  const foundProduct = products.find((item) => item._id == productId);

  useEffect(() => {
    setProductData(foundProduct);
    setMainImage(foundProduct?.image[0]);
    setSize('');
    setAdded(false);
    setActiveThumb(0);
  }, [productId, products]);

  if (isLoading) return <ProductSkeleton />
  if (!foundProduct) return <NotFound />

  // Stock badge logic
  const stock = productData?.stock || 0;
  
  const stockDisplay = stock === 0 ? (
    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200 animate-fade-up delay-200">
      <AlertCircle className="w-4 h-4" /> Out of Stock
    </span>
  ) : stock <= 3 ? (
    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-yellow-50 text-yellow-800 text-xs font-semibold border border-yellow-200 animate-fade-up delay-200">
      <AlertCircle className="w-4 h-4" /> Only {stock} left!
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200 animate-fade-up delay-200">
      <CheckCircle className="w-4 h-4" /> In Stock
    </span>
  );

  // Size Guide Modal
  const SizeGuide = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-fade-up">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-black dark:hover:text-white" onClick={() => setShowGuide(false)}>&times;</button>
        <h2 className="text-xl font-serif font-semibold mb-4">Size Guide</h2>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li><b>XS:</b> Bust 32" | Waist 24" | Hips 34"</li>
          <li><b>S:</b> Bust 34" | Waist 26" | Hips 36"</li>
          <li><b>M:</b> Bust 36" | Waist 28" | Hips 38"</li>
          <li><b>L:</b> Bust 38" | Waist 30" | Hips 40"</li>
          <li><b>XL:</b> Bust 40" | Waist 32" | Hips 42"</li>
        </ul>
      </div>
    </div>
  )

  return (
    <div className="border-t-2 pt-0 sm:pt-10 bg-offwhite dark:bg-black min-h-screen animate-fade animate-duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* GALLERY */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[520px] lg:max-h-[600px] pr-1 lg:pr-0">
              {productData?.image.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  onMouseEnter={() => { setMainImage(img); setActiveThumb(idx); }}
                  onClick={() => { setMainImage(img); setActiveThumb(idx); }}
                  className={`w-20 h-20 object-cover rounded-2xl shadow-md cursor-pointer transition-all duration-300 border-2 ${activeThumb === idx ? 'border-gold scale-105' : 'border-transparent'} bg-neutral-200 dark:bg-neutral-800 animate-fade-up delay-${100 + idx * 50}`}
                  style={{ minWidth: 80, minHeight: 80 }}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center min-h-[400px] lg:min-h-[600px]">
              <div className="relative w-full max-w-xl aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 rounded-3xl shadow-xl overflow-hidden animate-fade-up delay-150">
                <img
                  src={mainImage}
                  alt="main"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105 cursor-zoom-in"
                  style={{ minHeight: 320 }}
                />
              </div>
            </div>
          </div>
          {/* INFO PANEL */}
          <div className="flex-1 flex flex-col justify-center gap-6 animate-fade-up delay-200">
            <div className="flex items-center gap-4 mb-2">
              {stockDisplay}
              <span className="ml-auto text-xs text-gray-400 animate-fade-up delay-300">Estimated Delivery: 2–4 days</span>
            </div>
            <h1 className="text-4xl font-serif font-semibold text-charcoal dark:text-offwhite animate-fade-up delay-100">{productData?.name}</h1>
            <div className="text-3xl font-medium text-gold mt-4 animate-fade-up delay-200">{currency}{productData?.price}</div>
            <div className="text-gray-500 dark:text-gray-300 leading-relaxed text-lg mt-6 font-sans animate-fade-up delay-300">{productData?.description}</div>
            {/* SIZE SELECTOR */}
            <div className="flex flex-col gap-2 mt-8 animate-fade-up delay-400">
              <div className="flex items-center gap-2">
                <span className="font-medium text-base">Select size:</span>
                <button className="ml-2 text-xs text-gold underline underline-offset-2 hover:text-black dark:hover:text-white transition" onClick={() => setShowGuide(true)}>
                  Size Guide
                </button>
              </div>
              <ToggleGroup className="flex gap-3 mt-2" type="single" value={size} onValueChange={val => { setSize(val); setSizeError(false); }}>
                {productData?.sizes.map((item, idx) => (
                  <ToggleGroupItem
                    key={idx}
                    value={item}
                    className={`text-base rounded-full px-6 py-3 font-medium bg-white dark:bg-neutral-900 border border-gray-300 hover:border-black transition-all duration-200 ${size === item ? 'border-2 border-black bg-black text-white dark:bg-gold dark:text-black' : ''} ${sizeError ? 'ring-2 ring-red-400' : ''}`}
                  >
                    {item}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {sizeError && <div className="text-red-500 text-xs mt-1 animate-shake">Please select a size.</div>}
            </div>
            {/* ADD TO CART BUTTON */}
            <button
              onClick={() => {
                if (!size) {
                  setSizeError(true)
                  setTimeout(() => setSizeError(false), 1200)
                  return
                }
                if (token) {
                  addToCart(productData?._id, size)
                  setAdded(true)
                  setTimeout(() => setAdded(false), 1200)
                } else {
                  navigate('/login')
                }
              }}
              className={`w-full sm:w-auto rounded-full px-6 py-4 font-semibold text-sm bg-black text-white hover:bg-gold hover:text-black transition-all ease-in-out duration-300 mt-4 shadow-lg animate-fade-up delay-500 ${sizeError ? 'animate-shake ring-2 ring-red-400' : ''}`}
              disabled={stock === 0}
            >
              {stock === 0 ? 'Out of Stock' : (added ? 'Added to Cart!' : 'Add to Cart')}
            </button>
          </div>
        </div>
        {/* DESCRIPTION TABS */}
        <div className="mt-20 animate-fade-up delay-600">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="flex gap-2 w-fit mx-auto mb-6 border-none bg-transparent p-0">
              <TabsTrigger className="uppercase tracking-wider px-6 py-2 text-base font-semibold data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold transition-all duration-200 bg-transparent border-none rounded-none" value="description">
                Description
              </TabsTrigger>
              <TabsTrigger className="uppercase tracking-wider px-6 py-2 text-base font-semibold data-[state=active]:text-gold data-[state=active]:border-b-2 data-[state=active]:border-gold transition-all duration-200 bg-transparent border-none rounded-none" value="specs">
                Specifications
              </TabsTrigger>
            </TabsList>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-6 text-gray-700 dark:text-gray-200 text-base mt-0 w-full max-w-3xl mx-auto animate-fade-up delay-700">
              <TabsContent value="description">
                <div>
                  {productData?.longDescription || (
                    <>
                      This premium cotton t-shirt offers ultimate comfort and durability. Designed for everyday wear, it features a breathable fabric and a modern fit. Available in multiple colors to match any style.<br /><br />
                      Embrace timeless fashion with our Classic Relaxed-Fit Jacket—a versatile wardrobe staple that blends comfort with effortless style. Designed for everyday wear, this jacket offers a relaxed fit with a modern edge, perfect for layering in any season.
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="specs">
                <ul className="space-y-2">
                  <li><b>Material:</b> 100% Organic Cotton</li>
                  <li><b>Fit:</b> Regular / Slim</li>
                  <li><b>Care Instructions:</b> Machine wash cold, tumble dry low</li>
                  <li><b>Country of Origin:</b> Italy</li>
                </ul>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        {/* SIZE GUIDE MODAL */}
        {showGuide && <SizeGuide />}
        {/* RELATED PRODUCTS */}
        <div className="mt-24 animate-fade-up delay-800">
          <RelatedProducts category={productData?.category || ''} subcategory={productData?.subcategory || ''} id={productId} />
        </div>
      </div>
    </div>
  )
}

export default Product