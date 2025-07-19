import React from "react";

const policies = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/709/709790.png",
    title: "Free Returns",
    desc: "Shop with confidence — return within 14 days at no cost.",
    delay: ""
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/891/891462.png",
    title: "Fast Shipping",
    desc: "Express delivery on all orders, worldwide.",
    delay: "delay-100"
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
    title: "100% Authentic",
    desc: "Every piece is guaranteed original and exclusive.",
    delay: "delay-200"
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    title: "Dedicated Support",
    desc: "Our team is here for you, always.",
    delay: "delay-300"
  },
];

const OurPolicy = () => {
  return (
    <section className="w-full bg-offwhite py-24 px-4 sm:px-8 lg:px-20">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-center text-charcoal mb-12">Our Promise</h2>
        <p className="text-sm text-grayText text-center max-w-md mx-auto mb-16">Designed for confidence, comfort, and complete satisfaction.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-10">
          {policies.map((policy, idx) => (
            <div
              key={policy.title}
              className={`text-center px-4 py-6 rounded-xl bg-white shadow-sm hover:shadow-md transition animate-fade-up ${policy.delay}`}
            >
              <img
                src={policy.icon}
                alt={policy.title + ' icon'}
                className="w-10 h-10 mx-auto mb-4"
                loading="eager"
                style={{ display: 'block' }}
              />
              <h3 className="text-lg font-medium text-charcoal mb-2 font-serif">
                {policy.title}
              </h3>
              <p className="text-sm text-grayText">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;