'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion';

function Hero() {
  return (
    <motion.div animate={{ scale: 1 }} initial={{ scale: 0.5 }} transition={{ duration: 1.25 }}>
    <div className='mx-15 my-10'>
      <main className="hero-bg bg-cover bg-center h-120 rounded-2xl flex flex-col justify-center items-center gap-10">
        <h1 className='font-bold text-4xl text-center'>The One-Stop Gifting Solution | VAM Enterprises</h1>
        <h1 className='text-xl px-25 text-center'>Experience exclusive, premium gifting with VAM Enterprises—your one-stop destination for unique, luxury gifts.</h1>
        <Button className='rounded-3xl p-8 text-md' asChild>
          <Link href="/shop">Shop Now</Link>
        </Button>
      </main>
    </div>
    </motion.div>
  )
}

export default Hero
