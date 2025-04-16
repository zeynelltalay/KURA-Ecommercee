import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    console.log('Ödemeye geç butonuna tıklandı'); // Debug için log
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Sepetiniz boş</h2>
          <p className="mt-2 text-gray-600">
            Alışverişe başlamak için{' '}
            <Link to="/shop" className="text-purple-600 hover:text-purple-500">
              mağazayı
            </Link>{' '}
            ziyaret edin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sepetim</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Sepet Ürünleri */}
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Birim Fiyat: {item.price.toLocaleString('tr-TR')} ₺
                  </p>
                  
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    {(item.price * item.quantity).toLocaleString('tr-TR')} ₺
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Toplam */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium text-gray-900">Toplam</span>
              <span className="text-2xl font-bold text-purple-600">
                {totalPrice.toLocaleString('tr-TR')} ₺
              </span>
            </div>

            <Link 
              to="/checkout"
              className="mt-8 w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Ödemeye Geç</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 