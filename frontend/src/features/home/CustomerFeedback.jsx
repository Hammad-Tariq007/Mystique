import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Sophia L.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    feedback: "Absolutely obsessed with the fit and feel. Mystique is now my go-to.",
  },
  {
    name: "Amelia R.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    feedback: "The quality is unmatched. Every piece feels like it was made for me.",
  },
  {
    name: "Olivia M.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    feedback: "I get compliments every time I wear Mystique. Effortless luxury!",
  },
  {
    name: "Emma T.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    feedback: "Customer service is incredible. Fast shipping and beautiful packaging.",
  },
  {
    name: "Charlotte B.",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    feedback: "The best investment in my wardrobe. Timeless and chic.",
  },
  {
    name: "Mia K.",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    feedback: "Mystique's attention to detail is next level. I'm a fan for life!",
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 6000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
  appendDots: dots => (
    <div className="mt-8">
      <ul className="flex justify-center gap-2">{dots}</ul>
    </div>
  ),
  customPaging: i => (
    <button className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gold transition-all" />
  ),
};

const CustomerFeedback = () => {
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-8 lg:px-16 animate-fade-up">
      <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-center text-charcoal mb-12">
        What Our Customers Are Saying
      </h2>
      <Slider {...settings} className="">
        {testimonials.map((t, idx) => (
          <div key={idx} className="px-4">
            <div className="bg-offwhite rounded-xl p-6 shadow-card text-center hover:shadow-lg transition animate-fade-up">
              <img
                src={t.image}
                className="w-12 h-12 rounded-full mx-auto mb-4"
                alt={t.name}
                loading="lazy"
              />
              <h4 className="font-medium text-charcoal text-lg mb-2 font-serif">{t.name}</h4>
              <p className="text-sm text-grayText italic">"{t.feedback}"</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default CustomerFeedback; 