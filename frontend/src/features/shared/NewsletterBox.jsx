import React, { useState } from 'react';

const NewsletterBox = () => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="w-full bg-charcoal text-offwhite py-24 px-4 sm:px-12 lg:px-32 animate-fade-up">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left: Textual CTA */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-serif font-semibold leading-snug">
            Join the Mystique Circle
          </h2>
          <p className="text-sm text-gray-300 mt-4 max-w-md">
            Exclusive access to drops, private offers, and style secrets — straight to your inbox.
          </p>
        </div>
        {/* Right: Email Input */}
        <div className="w-full flex justify-center md:justify-end">
          {submitted ? (
            <div className="text-lg font-medium text-gold py-6">Thanks for joining!</div>
          ) : (
            <form
              onSubmit={onSubmitHandler}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 sm:mt-0 w-full max-w-xl"
            >
              <input
                type="email"
                placeholder="Your email address"
                required
                className="w-full sm:w-auto flex-grow px-4 py-3 text-sm text-charcoal rounded-full focus:outline-none rounded-3xl shadow-md"
              />
              <button
                type="submit"
                className="bg-gold text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-white hover:text-charcoal transition-all duration-300 transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterBox;