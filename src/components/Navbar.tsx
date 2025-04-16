import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, UserIcon, Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { logout, isAuthenticated, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-purple-600">
              KURA
            </Link>
          </div>

          {/* Orta Menü - Desktop */}
          <div className="hidden sm:flex sm:items-center sm:justify-center flex-1">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/shop"
                className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Mağaza
              </Link>
              <Link
                to="/about"
                className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Hakkımızda
              </Link>
              <Link
                to="/faq"
                className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                SSS
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                İletişim
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-purple-600 hover:text-purple-800 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Admin Paneli
                </Link>
              )}
            </div>
          </div>

          {/* Sağ Taraf - Sepet ve Kullanıcı */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCartIcon className="h-6 w-6 text-gray-600 hover:text-purple-600 transition-colors duration-200" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <UserIcon className="h-6 w-6 text-gray-600 hover:text-purple-600 transition-colors duration-200" />
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-purple-600 transition-colors duration-200"
              >
                Giriş Yap
              </Link>
            )}

            {/* Mobil Menü Butonu */}
            <div className="sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            >
              Mağaza
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            >
              Hakkımızda
            </Link>
            <Link
              to="/faq"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            >
              SSS
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
            >
              İletişim
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-purple-600 hover:text-purple-800 hover:bg-gray-50"
              >
                Admin Paneli
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 