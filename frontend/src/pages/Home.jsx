import React from 'react'
import Hero from '@/components/sections/Hero'
import BrandStory from '@/components/sections/BrandStory'
import LatestCollection from '@/features/home/LatestCollection'
import Bestseller from '@/features/home/Bestseller'
import OurPolicy from '@/features/home/OurPolicy'
import NewsletterBox from '@/features/shared/NewsletterBox'
import CustomerFeedback from '@/features/home/CustomerFeedback'

const Home = () => {
  return (
    <div className=' animate-fade animate-duration-500'>
      <Hero/>
      <BrandStory/>
      <LatestCollection/>
      <Bestseller/>
      <OurPolicy/>
      <NewsletterBox/>
      <CustomerFeedback/>
    </div>
  )
}

export default Home