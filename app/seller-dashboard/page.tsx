"use client"
import React from 'react';
import { useUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import Navbar from '../_components/Navbar';
import Footer from '../_components/Footer';

export default function SellerDashboardPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    if (!isLoaded || !isSignedIn) {
        return (
            <main>
                <div>
                    <Navbar/>
                </div>
                <div>
                    <h1 className="text-4xl text-center mt-[110px]">Please sign in with the admin account to access the Seller Dashboard.</h1>
                </div>
                <div className="bottom-0 absolute w-full">
                    <Footer/>
                </div>
            </main>
        )
    }
    const isAdmin = user?.publicMetadata?.role === 'admin'
    if (!isAdmin){
        notFound()
    }
  return (
    <div>
        <Navbar/>
        <h1>Seller Dashboard</h1>
        <p>Welcome to your seller dashboard. Here you can manage your products, view sales, and update your profile.</p>
        <Footer/>
    </div>
  );
}