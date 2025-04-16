import React from 'react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-600 opacity-10"></div>
          <div className="relative px-8 py-16 sm:px-12 lg:px-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Hikayemiz
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kura, özgün tasarımları ve işlevselliği bir araya getirerek günlük yaşamın her anında yanınızda olmayı hedefleyen bir çanta markasıdır. Şehir hayatının dinamik temposuna ayak uydururken tarzından ödün vermek istemeyenler için yola çıktık.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 sm:p-12 lg:p-16">
          {/* Tasarım Felsefemiz */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Tasarım Felsefemiz
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Her bir Kura çantası; sade ama çarpıcı tasarımı, kaliteli malzemesi ve kullanışlı detaylarıyla öne çıkar. Amacımız, sadece bir çanta değil, aynı zamanda sizi yansıtan bir stil ortağı sunmak.
            </p>
          </div>

          {/* Üretim Değerlerimiz */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Üretim Değerlerimiz
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Yerel üretime önem veriyor, sürdürülebilirlik değerlerimizi her adımda koruyoruz. El emeğiyle hazırlanan koleksiyonlarımızda, hem klasik hem de modern çizgileri harmanlayarak zamansız tasarımlar yaratıyoruz.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-8 py-12 sm:px-12 lg:px-16">
          <div className="text-center space-y-4">
            <p className="text-xl font-medium text-gray-900">
              Kura, seninle yola çıkmak için hazır.
            </p>
            <p className="text-lg text-gray-600">
              Sen de tarzını yansıt, hikâyeni Kura ile taşı.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 sm:p-12 lg:p-16 bg-white">
          {/* Kalite */}
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Premium Kalite</h3>
            <p className="text-gray-600">En kaliteli malzemeler ve işçilik</p>
          </div>

          {/* Tasarım */}
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Özgün Tasarım</h3>
            <p className="text-gray-600">Modern ve zamansız tasarımlar</p>
          </div>

          {/* Sürdürülebilirlik */}
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Sürdürülebilirlik</h3>
            <p className="text-gray-600">Çevreye duyarlı üretim</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 