// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} Griz. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400">
                <span className="sr-only">Privacy Policy</span>
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400">
                <span className="sr-only">Terms of Service</span>
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400">
                <span className="sr-only">Contact Us</span>
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;