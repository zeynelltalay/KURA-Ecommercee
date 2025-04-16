import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Kargo süresi ne kadardır?",
    answer: "Siparişleriniz en geç 2 iş günü içinde kargoya verilir ve genellikle 1-3 iş günü içinde teslim edilir."
  },
  {
    question: "İade ve değişim politikanız nedir?",
    answer: "Ürünlerimizde 14 gün içinde iade ve değişim hakkınız bulunmaktadır. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir."
  },
  {
    question: "Ödeme seçenekleri nelerdir?",
    answer: "Kredi kartı, havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur. Kredi kartına 6 taksit imkanı sunmaktayız."
  },
  {
    question: "Ürünler orijinal midir?",
    answer: "Tüm ürünlerimiz %100 orijinal ve garantilidir. Sahte ürün satışı kesinlikle yapılmamaktadır."
  },
  {
    question: "Kargo ücreti ne kadardır?",
    answer: "250 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 250 TL altı siparişlerde kargo ücreti 29.90 TL'dir."
  },
  {
    question: "Yurtdışına kargo yapıyor musunuz?",
    answer: "Şu an için sadece Türkiye içi sipariş kabul etmekteyiz. Yurtdışı gönderimi yapmamaktayız."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h1>
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
              onClick={() => toggleQuestion(index)}
            >
              <span className="font-semibold">{item.question}</span>
              <span className="transform transition-transform duration-200">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Başka Sorularınız mı Var?</h2>
        <p className="text-gray-700 mb-4">
          Burada cevabını bulamadığınız sorularınız için bize ulaşabilirsiniz.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          İletişime Geçin
        </a>
      </div>
    </div>
  );
};

export default FAQ; 