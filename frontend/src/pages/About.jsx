import React from 'react'
import NewsletterBox from '@/features/shared/NewsletterBox'
import { assets } from '@/assets/assets'

const features = [
  {
    icon: assets.qualityImg,
    title: 'Conscious Craftsmanship',
    desc: 'We believe in slow fashion — every piece is thoughtfully made with premium materials and enduring quality.'
  },
  {
    icon: assets.exchangeImg,
    title: 'Effortless Experience',
    desc: 'From seamless delivery to attentive support, we make luxury feel easy, personal, and always within reach.'
  },
  {
    icon: assets.supportImg,
    title: 'Everyday Luxury',
    desc: 'Mystique is designed for real life — wearable confidence, timeless silhouettes, and quiet statement.'
  }
]

const brandValues = [
  'We design in motion — not in trends.',
  'Your style is your signature. We just frame it.',
  'Fashion is quiet. But presence is loud.'
]

const About = () => {
  return (
    <div className="w-full bg-offwhite dark:bg-black text-charcoal dark:text-offwhite animate-fade animate-duration-500">
      {/* SECTION 1 — Hero + Welcome Intro */}
      <section className="w-full flex flex-col items-center py-24 px-6 sm:px-12 lg:px-32">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-center mb-4 animate-fade-up">About Mystique</h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-300 font-sans text-center mb-12 animate-fade-up delay-100">Timeless design. Effortless confidence.</p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-up delay-200">
          {/* Left: Editorial Image */}
          <div className="flex justify-center animate-fade-up">
            <img 
              src={assets.aboutMystique} 
              alt="Mystique editorial" 
              className="w-full max-w-xl h-[420px] md:h-[540px] object-cover rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-900" 
              style={{ minHeight: '320px' }}
            />
          </div>
          {/* Right: Welcome Text */}
          <div className="flex flex-col justify-center gap-6 px-2 md:px-0 animate-fade-up delay-300">
            <p className="font-serif text-2xl font-semibold tracking-tight mb-2"><span className="text-gold font-bold">Welcome to Mystique</span></p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 font-sans leading-relaxed tracking-tight mb-2 max-w-xl">
              Mystique is a modern women's fashion house, born from a passion for timeless design and the quiet power of feminine energy. Our collections are crafted for those who move with confidence and embrace their individuality. Every piece is designed to evoke effortless elegance—balancing contemporary silhouettes with classic sensibility. We believe in the beauty of restraint, the luxury of comfort, and the art of subtle statement.
            </p>
            <div className="mt-2">
              <h3 className="uppercase text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-widest mb-2">Our Mission</h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-sans leading-relaxed tracking-tight max-w-xl">
                At Mystique, we are committed to empowering women through fashion that feels as good as it looks. Our approach is rooted in responsible production, mindful sourcing, and a dedication to comfort—ensuring every garment is a celebration of both style and substance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — What Sets Us Apart */}
      <section className="w-full py-24 px-6 sm:px-12 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-center mb-16 tracking-tight animate-fade-up">What Sets Us Apart</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up delay-100">
          {features.map((f, idx) => (
            <div key={f.title} className="flex flex-col items-center text-center bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 px-8 py-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${150 + idx * 100}ms` }}>
              <img src={f.icon} alt={f.title} className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-xl font-serif font-semibold mb-3 text-gold tracking-tight">{f.title}</h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Brand Values Band */}
      <section className="w-full py-24 px-6 sm:px-12 lg:px-32 bg-offwhite dark:bg-black flex flex-col items-center">
        <div className="flex flex-col gap-8 w-full max-w-3xl">
          {[
            'We design for rhythm — not for trends.',
            'Your presence is the luxury.',
            'Subtle is stronger.'
          ].map((line, idx) => (
            <div
              key={line}
              className="group rounded-2xl bg-white dark:bg-neutral-900 border border-gold/20 shadow-md px-6 py-8 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:border-gold/60"
              style={{ animationDelay: `${100 + idx * 120}ms` }}
            >
              <span className="text-lg sm:text-xl font-serif text-center text-charcoal dark:text-offwhite font-medium tracking-tight leading-relaxed transition-colors duration-300 group-hover:text-gold">
                {line}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — Newsletter CTA (identical to homepage) */}
      <NewsletterBox />
    </div>
  )
}

export default About