import React from 'react';
import PriceDisplay from '../components/PriceDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <PriceDisplay />
      </main>
      <Footer />
    </div>
  );
}