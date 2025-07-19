import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '@/assets/assets';

const Hero = () => {
  return (
    <section className="relative min-h-[78vh] bg-offwhite flex items-center justify-center overflow-hidden pt-[90px] md:pt-[100px] pb-10 md:pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center md:items-start items-center text-center md:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-charcoal leading-tight mb-6">
              Discover Your <span className="text-gold">Signature Look</span>
            </h1>
            <p className="mt-2 text-base sm:text-lg text-grayText max-w-md font-body mb-8">
              Elevate your wardrobe with timeless pieces designed for modern women who value both elegance and individuality.
            </p>
            <Link 
              to="/collection"
              className="inline-block bg-charcoal text-offwhite px-8 py-4 rounded-full font-medium text-base transition-all duration-300 hover:bg-gold hover:text-black"
            >
              Explore Collection
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">
            <img 
              src={assets.hero}
              alt="Fashion editorial"
              className="w-full max-w-xl aspect-[3/2] object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 