import React, { useState, useEffect } from 'react';
import { UserIcon, MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface ProfileData {
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
}

const Profile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Form verilerini boş olarak başlat
  const [formData, setFormData] = useState<ProfileData>({
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
  });

  // Sayfa yüklendiğinde localStorage'dan form verilerini yükle
  useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Kaydedilmiş profil verisi yüklendi:', parsedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Profil verisi yüklenirken hata oluştu:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Yeni form verilerini oluştur
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    // State'i güncelle
    setFormData(updatedFormData);
    
    console.log('Profil verisi güncellendi:', updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form verilerini localStorage'a kaydet
    localStorage.setItem('profileData', JSON.stringify(formData));
    alert('Profil bilgileriniz başarıyla güncellendi!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmanız Gerekiyor</h2>
            <p className="text-gray-600 mb-6">Profil bilgilerinizi görüntülemek için lütfen giriş yapın.</p>
            <a
              href="/login"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Giriş Yap
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profilim</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kullanıcı Bilgileri */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <UserIcon className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Kişisel Bilgiler</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  name="firstName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Adınızı giriniz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Soyad</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  name="lastName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Soyadınızı giriniz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="E-posta adresinizi giriniz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Telefon numaranızı giriniz"
                  required
                />
              </div>
            </div>
          </div>

          {/* Adres Bilgileri */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MapPinIcon className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Adres Bilgileri</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Adres</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  name="address"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Adresinizi giriniz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">İlçe/İl</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.district}
                    onChange={handleInputChange}
                    name="district"
                    placeholder="İlçe"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    name="city"
                    placeholder="İl"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Posta Kodu</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  name="postalCode"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Posta kodunuzu giriniz"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          >
            Bilgileri Kaydet
          </button>
        </div>
      </form>

      {/* Sipariş Geçmişi */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <ShoppingBagIcon className="h-8 w-8 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Sipariş Geçmişi</h2>
        </div>
        <div className="space-y-6">
          {/* Siparişler burada görüntülenecek */}
        </div>
      </div>
    </div>
  );
};

export default Profile; 