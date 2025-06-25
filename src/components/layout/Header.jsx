import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Header = () => {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-cyan-400 bg-secondary' : 'text-gray-400 hover:text-white hover:bg-secondary/50'
    }`;

  return (
    <header className="py-4 px-4 md:px-8">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="text-cyan-400 h-6 w-6" />
          <span className="text-xl font-bold">
            <span className="gradient-text">Contact</span>Gain
          </span>
        </Link>
        <nav className="flex items-center gap-2 bg-card/50 border border-border/50 p-1 rounded-lg order-3 md:order-2 w-full md:w-auto justify-center">
            <NavLink to="/" className={navLinkClass} end>
                Home
            </NavLink>
            <NavLink to="/create" className={navLinkClass}>
                Create Session
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
                Contact Us
            </NavLink>
        </nav>
        <div className="text-right order-2 md:order-3">
            <p className="text-sm text-gray-400">Made by</p>
            <p className="font-bold text-white">HACKERPRO</p>
        </div>
      </div>
    </header>
  );
};

export default Header;