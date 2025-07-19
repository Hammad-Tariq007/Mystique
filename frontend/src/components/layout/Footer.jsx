import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-20 px-4 sm:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        {/* Brand Identity */}
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-serif font-semibold tracking-tight">Mystique</p>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Discover your signature look. Designed to move with you — timeless, feminine, and quietly powerful.
          </p>
        </div>
        {/* Navigation */}
        <div>
          <h4 className="uppercase text-sm font-medium mb-4 tracking-wide text-gray-300">Explore</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-white transition-all">Home</a></li>
            <li><a href="/collection" className="hover:text-white transition-all">Collection</a></li>
            <li><a href="/about" className="hover:text-white transition-all">About</a></li>
            <li><a href="/contact" className="hover:text-white transition-all">Contact</a></li>
          </ul>
        </div>
        {/* Newsletter CTA */}
        <div className="flex flex-col gap-4">
          <h4 className="uppercase text-sm font-medium tracking-wide text-gray-300">Stay in Touch</h4>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-neutral-800 text-sm px-4 py-3 rounded-full focus:outline-none text-white placeholder-gray-500 w-full"
            />
            <button
              type="submit"
              className="text-sm bg-white text-black px-5 py-3 rounded-full font-semibold hover:bg-gold hover:text-white transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} Mystique. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;