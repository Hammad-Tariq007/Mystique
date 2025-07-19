import React, { useContext, useMemo } from "react";
import { ShopContext } from "@/context/ShopContext";

const LatestCollection = () => {
  const { products = [], isLoading } = useContext(ShopContext);
  const featuredProducts = useMemo(() => products.slice(0, 3), [products]);

  if (isLoading) {
    return (
      <div className="my-10 gap-6 flex justify-center items-center">
        <div className="w-6 h-6 border-4 border-t-gray-800 border-gray-300 rounded-full animate-spin"></div>
        <p className="text-center py-8 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-offwhite dark:bg-black py-24 px-4 sm:px-12 lg:px-24 overflow-hidden">
      <h2 className="text-4xl font-serif font-semibold text-charcoal dark:text-white mb-16 text-center animate-fade-up">
        Latest Arrivals
      </h2>
      {/* Responsive: grid on md+, horizontal scroll on mobile/tablet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:overflow-visible overflow-x-auto no-scrollbar animate-fade-up min-w-0 pl-1 pr-4 sm:pr-8">
        {featuredProducts.length === 0 ? (
          <p className="text-grayText dark:text-gray-400 text-sm text-center py-20 w-full">No new arrivals yet. Check back soon.</p>
        ) : (
          featuredProducts.map((product) => (
            <div
              key={product._id}
              className="relative group bg-white dark:bg-neutral-900 rounded-3xl shadow-card overflow-hidden min-w-[260px] sm:min-w-[280px] md:min-w-0"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <a
                  href={`/product/${product._id}`}
                  className="text-sm uppercase tracking-wider bg-white text-black px-6 py-2 rounded-full hover:bg-gold hover:text-white transition-all"
                >
                  View Product
                </a>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-serif text-charcoal dark:text-white">{product.name}</h3>
                <p className="text-sm text-grayText dark:text-gray-400">{product.category}</p>
                <p className="text-base font-medium text-gold">${product.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-16 text-center animate-fade-up delay-300">
        <a
          href="/collection"
          className="inline-block uppercase text-sm tracking-wider border border-charcoal dark:border-white text-charcoal dark:text-white px-6 py-3 rounded-full hover:bg-charcoal dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-300"
        >
          View All
        </a>
      </div>
    </section>
  );
};

export default LatestCollection;
