import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Hakkımızda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <img
            src="/about/store.jpg"
            alt="Mağazamız"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Hikayemiz</h2>
          <p className="text-gray-700 leading-relaxed">
            2024 yılında kurulan markamız, modern ve şık çanta tasarımlarıyla
            müşterilerimizin hayatına değer katmayı amaçlamaktadır. Her ürünümüz
            özenle seçilmiş malzemelerle üretilmekte ve en son moda trendleriyle
            buluşmaktadır.
          </p>
          
          <h2 className="text-2xl font-semibold pt-4">Misyonumuz</h2>
          <p className="text-gray-700 leading-relaxed">
            Müşterilerimize en kaliteli ürünleri, en uygun fiyatlarla sunmak ve
            alışveriş deneyimlerini en üst seviyeye çıkarmak için çalışıyoruz.
            Sürdürülebilirlik ve müşteri memnuniyeti bizim için en önemli değerlerdir.
          </p>
          
          <h2 className="text-2xl font-semibold pt-4">Değerlerimiz</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Kaliteden ödün vermemek</li>
            <li>Müşteri memnuniyetini ön planda tutmak</li>
            <li>Çevreye duyarlı üretim yapmak</li>
            <li>Trend ve modayı takip etmek</li>
            <li>Sürdürülebilir büyüme sağlamak</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Neden Bizi Tercih Etmelisiniz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Kaliteli Ürünler</h3>
            <p className="text-gray-700">
              En kaliteli malzemelerle üretilen ürünlerimiz uzun ömürlü kullanım sağlar.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Hızlı Teslimat</h3>
            <p className="text-gray-700">
              Siparişleriniz en geç 2 iş günü içinde kargoya verilir.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Müşteri Desteği</h3>
            <p className="text-gray-700">
              7/24 müşteri hizmetleri desteğiyle yanınızdayız.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 