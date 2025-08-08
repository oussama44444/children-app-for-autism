import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#1B1F38] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
      
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-transparent border-2 border-cyan-400 w-10 h-10 flex items-center justify-center rounded-md">
            <span className="text-cyan-400 font-bold">SVT</span>
          </div>
           <span>|</span>
          <div className="text-left leading-tight">
            <p className="text-sm font-medium">Virtual Class</p>
            <p className="text-sm font-medium">for Zoom</p>
          </div>
        </div>

        
        <div className="mb-6 pt-10 text-center">
          <p className="mb-3 text-gray-300 font-medium">Subscribe to get our Newsletter</p>
         <form className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0">
  <input
    type="email"
    placeholder="Your Email"
    className="rounded-full w-70 px-4 py-2 bg-[#1B1F38] border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
  />
  <button
    type="submit"
    className="bg-cyan-400 text-[#1B1F38] px-5 py-2 rounded-full w-30 font-semibold hover:bg-cyan-300 transition"
  >
    Subscribe
  </button>
</form>

        </div>

        {/* Links */}
        <div className="text-sm text-gray-400 pt-15 space-x-4 mb-2">
          <Link href="#" className="hover:text-white">Careers</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">Terms & Conditions</Link>
        </div>

        <div className="text-xs text-gray-500">
          © 2024 Class Technologies Inc.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
