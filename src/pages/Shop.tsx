import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

interface Bag {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const allBags: Bag[] = [
  {
    id: 1,
    name: "Klasik Deri Çanta",
    price: 599.99,
    image: "/bags/leatherbag.png",
    description: "Yüksek kaliteli deri ile üretilmiş klasik tasarım"
  },
  {
    id: 2,
    name: "Modern Omuz Çantası",
    price: 449.99,
    image: "/bags/modern-shoulder.png",
    description: "Şık ve kullanışlı modern omuz çantası"
  },
  {
    id: 3,
    name: "Mini Clutch",
    price: 299.99,
    image: "/bags/mini-clutch.png",
    description: "Özel günler için ideal mini clutch"
  },
  {
    id: 4,
    name: "Seyahat Çantası",
    price: 799.99,
    image: "/bags/travel-bag.png",
    description: "Dayanıklı ve geniş seyahat çantası"
  },
  {
    id: 5,
    name: "Sırt Çantası",
    price: 399.99,
    image: "/bags/backpack.png",
    description: "Günlük kullanım için konforlu sırt çantası"
  },
  {
    id: 6,
    name: "Duffel Çanta",
    price: 349.99,
    image: "/bags/duffel.png",
    description: "Spor ve seyahat için ideal duffel çanta"
  },
  {
    id: 7,
    name: "Messenger Çanta",
    price: 449.99,
    image: "/bags/messenger.png",
    description: "İş ve okul için ideal messenger çanta"
  },
  {
    id: 8,
    name: "Tote Çanta",
    price: 379.99,
    image: "/bags/tote.png",
    description: "Günlük kullanım için geniş ve şık tote çanta"
  }
];

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [filteredBags, setFilteredBags] = useState<Bag[]>(allBags);

  // Fiyat filtresini uygula
  useEffect(() => {
    const filtered = allBags.filter(bag => 
      bag.price >= minPrice && bag.price <= maxPrice
    );
    setFilteredBags(filtered);
  }, [minPrice, maxPrice]);

  // Fiyat aralığını güncelle
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMaxPrice(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-purple-800">Mağaza</h1>
      
      {/* Fiyat Filtresi */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Fiyat Filtresi</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 mb-2">Minimum Fiyat</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 TL</span>
              <span>{minPrice} TL</span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 mb-2">Maksimum Fiyat</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0 TL</span>
              <span>{maxPrice} TL</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-600">
          Fiyat Aralığı: {minPrice} TL - {maxPrice} TL
        </div>
      </div>
      
      {/* Ürünler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBags.map((bag) => (
          <div key={bag.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative pt-[100%] bg-gray-50">
              <img
                src={bag.image}
                alt={bag.name}
                className="absolute top-0 left-0 w-full h-full object-cover p-4 hover:p-2 transition-all duration-300"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.png';
                  target.className = target.className.replace('object-cover', 'object-contain p-8');
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-700 hover:text-purple-900 transition-colors">{bag.name}</h3>
              <p className="text-gray-600 mb-4 min-h-[48px]">{bag.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-purple-600">{bag.price.toFixed(2)} TL</span>
                <button 
                  onClick={() => addToCart(bag)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:shadow-lg text-lg"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBags.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Bu fiyat aralığında ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default Shop; 