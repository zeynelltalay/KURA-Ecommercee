import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCardIcon, LockClosedIcon, UserIcon, HomeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { processPayment } from '../services/paymentService';

// Form verilerinin tipini tanımla
interface FormData {
  // Kişisel Bilgiler
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Adres Bilgileri
  address: string;
  city: string;
  district: string;
  postalCode: string;
  // Ödeme Bilgileri
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, totalPrice } = useCart();
  const { currentUser } = useAuth();
  
  // Form verilerini boş olarak başlat
  const [formData, setFormData] = useState<FormData>({
    // Kişisel Bilgiler
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Adres Bilgileri
    address: '',
    city: '',
    district: '',
    postalCode: '',
    // Ödeme Bilgileri
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 3;
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Kullanıcı girişi kontrolü
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [currentUser, navigate]);

  // Sayfa yüklendiğinde localStorage'dan form verilerini yükle
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Kaydedilmiş form verisi yüklendi:', parsedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Form verisi yüklenirken hata oluştu:', error);
      }
    }
  }, []);

  // Form verilerini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    console.log('Form verisi kaydedildi:', formData);
  }, [formData]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Kredi kartı numarası formatlaması için yardımcı fonksiyon
  const formatCreditCardNumber = (value: string): string => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, '');
    
    // 16 karakterden fazlasını kes
    const trimmed = numbers.slice(0, 16);
    
    // 4'lü gruplar halinde böl
    const groups = trimmed.match(/.{1,4}/g);
    
    // Grupları boşlukla birleştir
    return groups ? groups.join(' ') : trimmed;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;

    // Input tipine göre özel formatlamalar
    switch (name) {
      case 'cardNumber':
        formattedValue = formatCreditCardNumber(value);
        break;
      case 'expiryDate':
        // AA/YY formatı için
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/^([0-9]{2})/, '$1/')
          .substr(0, 5);
        break;
      case 'cvv':
        // Sadece 3 rakam
        formattedValue = value.replace(/\D/g, '').substr(0, 3);
        break;
      default:
        formattedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Form validasyonu için yardımcı fonksiyon
  const validateForm = () => {
    // Kart numarası kontrolü
    if (!formData.cardNumber.replace(/\s/g, '').match(/^[0-9]{16}$/)) {
      setError('Geçerli bir kredi kartı numarası giriniz');
      return false;
    }

    // Kart sahibi adı kontrolü
    if (!formData.cardName.trim()) {
      setError('Kart üzerindeki ismi giriniz');
      return false;
    }

    // Son kullanma tarihi kontrolü
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Geçerli bir son kullanma tarihi giriniz (AA/YY)');
      return false;
    }

    // CVV kontrolü
    if (!formData.cvv.match(/^[0-9]{3}$/)) {
      setError('Geçerli bir CVV giriniz');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    if (!currentUser) {
      setError('Oturum açmanız gerekiyor');
      setIsProcessing(false);
      return;
    }

    // Form validasyonunu kontrol et
    if (!validateForm()) {  // validateForm fonksiyonunu burada kullan
      setIsProcessing(false);
      return;
    }

    try {
      const paymentResult = await processPayment(
        {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        },
        {
          userId: currentUser.uid,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
          })),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            postalCode: formData.postalCode,
            phone: formData.phone,
            email: formData.email
          },
          totalAmount: totalPrice,
          paymentMethod: 'credit_card'
        }
      );

      if (paymentResult.success) {
        clearCart();
        localStorage.removeItem('checkoutFormData');
        navigate('/order-success', { 
          state: { 
            orderId: paymentResult.orderId,
            totalAmount: totalPrice
          }
        });
      } else {
        setError(paymentResult.error || 'Ödeme işlemi başarısız oldu');
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      setError('Ödeme işlemi sırasında bir hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  // Form validasyonu için fonksiyonlar
  const validatePersonalInfo = () => {
    if (!formData.firstName.trim()) {
      setError('Lütfen adınızı giriniz');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Lütfen soyadınızı giriniz');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Lütfen telefon numaranızı giriniz');
      return false;
    }
    return true;
  };

  const validateAddressInfo = () => {
    if (!formData.address.trim()) {
      setError('Lütfen adres giriniz');
      return false;
    }
    if (!formData.city.trim()) {
      setError('Lütfen şehir giriniz');
      return false;
    }
    if (!formData.district.trim()) {
      setError('Lütfen ilçe giriniz');
      return false;
    }
    if (!formData.postalCode.trim()) {
      setError('Lütfen posta kodu giriniz');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError(''); // Her adımda hata mesajını temizle

    // Adıma göre validasyon yap
    let isValid = true;
    if (activeStep === 1) {
      isValid = validatePersonalInfo();
    } else if (activeStep === 2) {
      isValid = validateAddressInfo();
    }

    if (isValid && activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Sepet boş kontrolü
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Kullanıcı girişi yapılmamışsa loading göster
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= activeStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < activeStep ? <CheckCircleIcon className="h-6 w-6" /> : step}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">
                  {step === 1 ? 'Kişisel Bilgiler' : step === 2 ? 'Adres Bilgileri' : 'Ödeme'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`h-1 w-full ${step <= activeStep ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Bölümü */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              {activeStep === 1 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Kişisel Bilgiler</h2>
                    <UserIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        Ad
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                        placeholder=""
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                        placeholder=""
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                        placeholder=""
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Adres Bilgileri</h2>
                    <HomeIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Adres
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                        placeholder=""
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          Şehir
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                          placeholder=""
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                          İlçe
                        </label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                          placeholder=""
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                          Posta Kodu
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                          placeholder=""
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Ödeme Bilgileri</h2>
                    <CreditCardIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Kart Numarası
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="0000 0000 0000 0000"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 pr-12 py-3"
                            maxLength={19} // 16 rakam + 3 boşluk
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg 
                              className="h-5 w-5 text-gray-400" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                          placeholder="Kart üzerindeki ismi giriniz"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Son Kullanma Tarihi
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                            placeholder="AA/YY formatında giriniz"
                            maxLength={5}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-4 py-3"
                            placeholder="CVV kodunu giriniz"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center">
                        <LockClosedIcon className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm text-gray-600">Güvenli Ödeme</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={`w-full bg-purple-600 text-white px-8 py-3 rounded-lg 
                          hover:bg-purple-700 focus:outline-none focus:ring-2 
                          focus:ring-purple-500 focus:ring-offset-2 transition-all 
                          duration-200 transform hover:scale-105
                          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Ödeme İşleniyor...
                          </div>
                        ) : (
                          'Ödemeyi Tamamla'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {activeStep > 1 && (
                  <button
                    onClick={prevStep}
                    disabled={isProcessing}
                    className={`px-6 py-3 border border-gray-300 rounded-lg text-gray-700 
                      hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 
                      focus:ring-offset-2 transition-colors
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Geri
                  </button>
                )}
                {activeStep < totalSteps && (
                  <button
                    onClick={nextStep}
                    disabled={isProcessing}
                    className={`${activeStep === 1 ? 'ml-auto' : ''} 
                      bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                      transition-colors
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {activeStep === totalSteps - 1 ? 'Ödemeye Geç' : 'İleri'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-xl sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Sipariş Özeti</h2>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} TL
                    </p>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Ara Toplam</span>
                    <span className="text-base font-medium text-gray-900">{calculateTotal().toFixed(2)} TL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Kargo</span>
                    <span className="text-base font-medium text-green-600">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-medium text-gray-900">Toplam</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {calculateTotal().toFixed(2)} TL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yükleme Göstergesi */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              <p className="text-gray-700">İşleminiz gerçekleştiriliyor...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout; 