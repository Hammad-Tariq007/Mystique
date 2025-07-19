import React from 'react';
import NewsletterBox from '@/features/shared/NewsletterBox';
import { assets } from '@/assets/assets';

const jobs = [
  {
    title: 'Senior Fashion Designer',
    location: 'London, UK',
    type: 'Full-time',
    desc: 'Lead the creative direction for seasonal collections. Minimum 5 years experience in luxury fashion required.'
  },
  {
    title: 'E-Commerce Manager',
    location: 'Remote',
    type: 'Full-time',
    desc: 'Drive our online growth and customer experience. Experience with premium/luxury e-commerce platforms preferred.'
  },
  {
    title: 'Brand Content Editor',
    location: 'Paris, FR',
    type: 'Part-time',
    desc: 'Craft editorial stories and campaign copy for a global audience. Strong portfolio and luxury sensibility a must.'
  }
];

const Careers = () => {
  return (
    <div className="w-full bg-offwhite dark:bg-black text-charcoal dark:text-offwhite animate-fade animate-duration-500">
      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center py-24 px-6 sm:px-12 lg:px-32">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-center mb-4 animate-fade-up">Careers at Mystique</h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-300 font-sans text-center mb-12 animate-fade-up delay-100 max-w-2xl">Join a team where creativity, craftsmanship, and luxury meet. Shape the future of fashion with us.</p>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-up delay-200">
          <div className="flex justify-center animate-fade-up">
            <img 
              src={assets.careerImg} 
              alt="Mystique Careers" 
              className="w-full max-w-xl h-[420px] md:h-[540px] object-cover rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-900" 
              style={{ minHeight: '320px' }}
            />
          </div>
          <div className="flex flex-col justify-center gap-6 px-2 md:px-0 animate-fade-up delay-300">
            <p className="font-serif text-2xl font-semibold tracking-tight mb-2"><span className="text-gold font-bold">Work with visionaries</span></p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 font-sans leading-relaxed tracking-tight mb-2 max-w-xl">
              At Mystique, we believe in nurturing talent and empowering every team member to make their mark. Our culture is rooted in respect, innovation, and a shared passion for timeless style. If you crave a place where your ideas matter and your craft is celebrated, you belong here.
            </p>
          </div>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="w-full py-20 px-6 sm:px-12 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-center mb-16 tracking-tight animate-fade-up">Why Work With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up delay-100">
          <div className="flex flex-col items-center text-center bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 px-8 py-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '150ms' }}>
            <img src={assets.qualityImg} alt="Craft" className="w-12 h-12 mb-6 opacity-80" />
            <h3 className="text-xl font-serif font-semibold mb-3 text-gold tracking-tight">Craft & Creativity</h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs">Work with the best in the industry and bring your creative vision to life in every detail.</p>
          </div>
          <div className="flex flex-col items-center text-center bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 px-8 py-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '250ms' }}>
            <img src={assets.exchangeImg} alt="Growth" className="w-12 h-12 mb-6 opacity-80" />
            <h3 className="text-xl font-serif font-semibold mb-3 text-gold tracking-tight">Growth & Opportunity</h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs">Advance your career with mentorship, learning, and a global platform for your talent.</p>
          </div>
          <div className="flex flex-col items-center text-center bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 px-8 py-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '350ms' }}>
            <img src={assets.supportImg} alt="Culture" className="w-12 h-12 mb-6 opacity-80" />
            <h3 className="text-xl font-serif font-semibold mb-3 text-gold tracking-tight">Inclusive Culture</h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs">Be part of a supportive, diverse, and inspiring team that values your unique perspective.</p>
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="w-full py-20 px-6 sm:px-12 lg:px-32">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-center mb-16 tracking-tight animate-fade-up">Open Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up delay-100">
          {jobs.map((job, idx) => (
            <div key={job.title} className="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gold/30 px-8 py-10 animate-fade-up" style={{ animationDelay: `${150 + idx * 100}ms` }}>
              <h3 className="text-xl font-serif font-semibold mb-2 text-neutral-900 dark:text-offwhite tracking-tight">{job.title}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block bg-gold/20 text-gold font-semibold text-xs px-3 py-1 rounded-full">{job.type}</span>
                <span className="text-xs text-gray-500">{job.location}</span>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-200 mb-6">{job.desc}</p>
              <a href="mailto:careers@mystique.com?subject=Application: {job.title}" className="mt-auto inline-block bg-gold text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-black hover:text-gold transition-all text-sm">Apply Now</a>
            </div>
          ))}
        </div>
        <div className="text-center mt-16 animate-fade-up delay-300">
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2">Don't see your dream role?</p>
          <a href="mailto:careers@mystique.com" className="inline-block font-semibold text-gold hover:underline text-lg">Send us your CV &rarr;</a>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <NewsletterBox />
    </div>
  );
};

export default Careers; 