import React from 'react'

const Navbar = ({ setToken }) => {
  const logoutHandler = () => setToken('');
  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex items-center justify-between animate-fade-up">
      <p className="text-2xl font-serif font-semibold text-gray-800 tracking-wide">Mystqiue Admin</p>
      <button
        onClick={logoutHandler}
        className="bg-black text-white text-sm px-5 py-2 rounded-full transition-all duration-300 hover:bg-neutral-800 active:scale-95 font-sans"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;