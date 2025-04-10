import React from 'react';
import { useCart } from '../context/CartContext';

interface Bag {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const featuredBags: Bag[] = [
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

const Home: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-12 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-purple-800">Şık ve Kaliteli Çantalar</h1>
          <p className="text-xl text-purple-600">En yeni koleksiyonumuzu keşfedin</p>
        </section>

        {/* Featured Products */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-purple-800">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBags.map((bag) => (
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
        </section>

        {/* About Section */}
        <section className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 mb-16 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-800">Hakkımızda</h2>
          <p className="text-gray-700 leading-relaxed">
            Biz, kaliteli ve şık çanta tasarımlarıyla müşterilerimizin hayatına değer katmayı amaçlayan
            bir markayız. Her ürünümüz özenle seçilmiş malzemelerle üretilmekte ve modern tasarımlarla
            buluşmaktadır. Müşteri memnuniyeti bizim için en önemli önceliktir.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home; 