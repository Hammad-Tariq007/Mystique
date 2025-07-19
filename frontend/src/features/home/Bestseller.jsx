import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/context/ShopContext'
import { motion } from 'framer-motion'

const Bestseller = () => {

    const { products } = useContext(ShopContext)
    const [ bestSeller, setBestSeller ] = useState([])

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0,8))
    },[products])
  return (
    <section className="w-full bg-peach py-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-charcoal text-center mb-6">
          Bestsellers
        </h2>
        <p className="text-sm text-grayText text-center max-w-md mx-auto mb-12">
          Most-loved styles, restocked just for you.
        </p>
        {bestSeller.length === 0 ? (
          <p className="text-grayText text-center py-20 text-sm animate-fade-up">
            No bestsellers available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {bestSeller.map((item, idx) => (
              <motion.div
                key={item._id}
                className="rounded-2xl overflow-hidden border border-gray-200 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl bg-white animate-fade-up"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
              >
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="aspect-[3/4] object-cover w-full h-full"
                />
                <div className="p-5">
                  <div className="text-lg font-medium mt-4 text-charcoal font-serif">
                    {item.name}
                  </div>
                  <div className="text-sm text-grayText mt-1">${item.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <a
            href="/collection"
            className="text-sm tracking-wide uppercase underline text-charcoal hover:text-gold transition"
          >
            View All Bestsellers
          </a>
        </div>
      </div>
    </section>
  )
}

export default Bestseller