import React, { useContext } from 'react';
import Title from '@/components/Title';
import { assets } from '@/assets/assets';
import { ShopContext } from '@/context/ShopContext';

const Contact = () => {
  const { navigate } = useContext(ShopContext);

  return (
    <div className='animate-fade animate-duration-500'>
      {/* Page Title */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1='CONTACT' text2='US' />
      </div>

      {/* Contact Info Section */}
      <div className='my-10 flex flex-col md:justify-evenly md:flex-row gap-10 mb-28'>
        {/* Contact Image */}
        <img className='w-full md:max-w-[480px]' src={assets.contactImg} alt='contact' />
        
        {/* Contact Details */}
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store Location</p>
          <p className='text-gray-500'>📍 Plot # 120 A, Commercial, Block A Satellite Town, Gujranwala, 52250</p>
          <p className='text-gray-500'>📞 Tel: +92 316 7046744</p>
          <p className='text-gray-500'>✉️ Email: mystique123@gmail.com</p>
          
          <p className='font-semibold text-xl text-gray-600'>Careers</p>
          <p className='text-gray-500'>Learn more about job postings in our company.</p>
          <button 
            className='border border-black px-8 py-4 text-sm hover:bg-slate-700 hover:text-white transition-all duration-300'
            onClick={() => navigate('/careers')}
          >
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
