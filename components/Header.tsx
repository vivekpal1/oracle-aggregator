import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-100">
              Oracle Aggregator
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-gray-100 hover:text-blue-100 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-100 hover:text-blue-100 transition-colors">
                  Video
                </Link>
              </li>
              <li>
                <Link href="https://github.com/vivekpal1/oracle-aggregator" className="text-gray-100 hover:text-blue-100 transition-colors">
                  Github
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;