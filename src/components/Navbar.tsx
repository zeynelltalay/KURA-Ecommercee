import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 
            onClick={() => window.location.href = '/'}
            className="text-5xl font-bold cursor-pointer hover:text-purple-200 transition-colors"
          >
            KURA
          </h1>
          <div className="hidden md:flex space-x-6">
            <Link to="/shop" className="hover:text-purple-200 font-medium transition-colors">
              Mağaza
            </Link>
            <Link to="/about" className="hover:text-purple-200 font-medium transition-colors">
              Hakkımızda
            </Link>
            <Link to="/faq" className="hover:text-purple-200 font-medium transition-colors">
              SSS
            </Link>
            <Link to="/contact" className="hover:text-purple-200 font-medium transition-colors">
              İletişim
            </Link>
          </div>
        </div>

        {/* Search, Login, and Cart */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Ara..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:border-purple-500 bg-white/90 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-purple-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="relative group">
            {isAuthenticated ? (
              <>
                <button className="text-white hover:text-purple-200 transition-colors flex items-center space-x-1">
                  <UserIcon className="h-6 w-6" />
                  <span>Hesabım</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      Profilim
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="text-white hover:text-purple-200 transition-colors flex items-center space-x-1">
                <UserIcon className="h-6 w-6" />
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>
            
          <Link to="/cart" className="text-white hover:text-purple-200 transition-colors relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link
            to="/shop"
            className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Mağaza
          </Link>
          <Link
            to="/about"
            className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Hakkımızda
          </Link>
          <Link
            to="/faq"
            className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
          >
            SSS
          </Link>
          <Link
            to="/contact"
            className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
          >
            İletişim
          </Link>
          <Link
            to="/cart"
            className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium"
          >
            Sepet ({totalItems})
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 