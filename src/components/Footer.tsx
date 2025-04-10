import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shipping and Returns */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Gönderim ve İadeler</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-purple-100 hover:text-white transition-colors">
                  Kargo Bilgileri
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-purple-100 hover:text-white transition-colors">
                  İade Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Policy */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Mağaza Politikası</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-purple-100 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-purple-100 hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">Ödeme Yöntemleri</h3>
            <ul className="space-y-2">
              <li className="text-purple-100">Kredi Kartı</li>
              <li className="text-purple-100">Havale/EFT</li>
              <li className="text-purple-100">Kapıda Ödeme</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-200">İletişim</h3>
            <ul className="space-y-2">
              <li className="text-purple-100">
                Email: kura@gmail.com
              </li>
              <li className="flex space-x-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-purple-100 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-purple-100 hover:text-white transition-colors">
                  Instagram
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-purple-100 hover:text-white transition-colors">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Cookie Policy */}
        <div className="mt-8 pt-8 border-t border-purple-700">
          <p className="text-center text-purple-200">
            <Link to="/cookies" className="hover:text-white transition-colors">
              Çerez Politikası
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 