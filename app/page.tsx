import React from 'react';
import PriceDisplay from '../components/PriceDisplay';
import Header from '../components/Header';
import Footer from '../components/Footer';

async function getFeeds() {
  try {
    const res = await fetch('http://localhost:3000/api/price-feeds', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log('Fetched data:', data);  // Log the fetched data
    return data;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    throw error;
  }
}

export default async function Home() {
  let feeds;
  try {
    feeds = await getFeeds();
  } catch (error) {
    console.error('Error in Home component:', error);
    return <div>Error loading price feeds. Please try again later.</div>;
  }

  if (!feeds || Object.keys(feeds).length === 0) {
    return <div>No price feed data available.</div>;
  }

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