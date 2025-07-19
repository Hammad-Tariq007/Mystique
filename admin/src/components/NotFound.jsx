import React from 'react'

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-100 px-6 py-16">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-up">
        {/* Left: Text Block */}
        <div className="flex flex-col items-start justify-center text-left">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-gray-900 mb-6 animate-fade-up">Welcome to Mystique</h1>
          <p className="text-xl sm:text-2xl text-gray-500 max-w-xl font-light animate-fade-up delay-100">
            "Empowering modern femininity through fashion — one collection at a time."
          </p>
        </div>
        {/* Right: Editorial Image */}
        <div className="flex justify-center items-center w-full">
          <div className="relative w-full flex justify-center">
            {/* Optional blurred background orb for luxury effect */}
            <div className="absolute inset-0 flex justify-center items-center z-0">
              <div className="w-[90%] h-full bg-white/40 rounded-3xl blur-2xl backdrop-blur-sm" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=1400&q=80"
              alt="Glamify editorial"
              className="relative z-10 max-w-2xl w-full rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound