import React from 'react';
import PriceDisplay from '../components/PriceDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';

async function getFeeds() {
  const res = await fetch('http://localhost:3000/api/price-feeds', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch feeds');
  }
  return res.json();
}

export default async function Home() {
  const feeds = await getFeeds();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <PriceDisplay feeds={feeds} />
      </main>
      <Footer />
    </div>
  );
}