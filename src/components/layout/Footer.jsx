import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Home, PlusCircle, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/30 border-t border-border/50 mt-12">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Zap className="text-cyan-400 h-6 w-6" />
              <span className="text-xl font-bold">
                <span className="gradient-text">Contact</span>Gain
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Effortlessly collect and share contacts in VCF format.
            </p>
             <div className="mt-4">
                <p className="text-sm text-gray-400">Made by</p>
                <p className="font-bold text-white">HACKERPRO</p>
            </div>
          </div>
          
          <div>
            <p className="font-bold text-white mb-4 text-lg">Quick Links</p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Home className="w-4 h-4" /> Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center md:justify-start gap-2">
                  <PlusCircle className="w-4 h-4" /> Create Session
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
             <p className="font-bold text-white mb-4 text-lg">Legal</p>
             <p className="text-gray-400 text-sm">
                This is a project for demonstration purposes.
             </p>
          </div>
        </div>
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} ContactGain. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;