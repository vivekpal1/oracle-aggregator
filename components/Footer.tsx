import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">
              © {new Date().getFullYear()} Oracle Aggregator. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Twitter size={24} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;