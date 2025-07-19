import React from 'react';

const BrandStory = () => {
  return (
    <section className="bg-black text-white py-32 px-0 overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
          {/* LEFT COLUMN (text) */}
          <div className="flex flex-col justify-center md:items-start items-center text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl font-serif font-semibold leading-tight mb-6 animate-fade-up">
              A signature style born from timeless femininity.
            </h2>
            <p className="text-base text-gray-300 leading-relaxed mb-6 max-w-lg animate-fade-up delay-100">
              Mystique is more than clothing — it's movement, identity, and quiet strength. Designed to empower, crafted to endure.
            </p>
            <a
              href="/about"
              className="text-sm uppercase tracking-widest text-gold hover:text-white underline underline-offset-4 transition-all animate-fade-up delay-200"
            >
              Learn More About Us
            </a>
          </div>
          {/* RIGHT COLUMN (image) */}
          <div className="flex justify-center md:justify-end w-full h-full">
            <img
              src="https://images.pexels.com/photos/6810134/pexels-photo-6810134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Mystique model"
              className="w-full h-full object-cover rounded-3xl shadow-xl min-h-[400px] md:min-h-[500px] animate-fade-up delay-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory; 