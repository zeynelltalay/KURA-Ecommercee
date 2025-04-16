import React, { useState, useEffect } from 'react';
import { UserIcon, MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ClockIcon, TruckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

interface Order {
  id: string;
  createdAt: Date;
  totalAmount: number;
  status: 'completed' | 'pending' | 'failed';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
    email: string;
  };
}

const Profile: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'profile' veya 'orders'

  // Tarih formatlaması için yardımcı fonksiyon
  const formatDate = (date: Date) => {
    const aylar = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    
    const gun = date.getDate();
    const ay = aylar[date.getMonth()];
    const yil = date.getFullYear();
    const saat = date.getHours().toString().padStart(2, '0');
    const dakika = date.getMinutes().toString().padStart(2, '0');
    
    return `${gun} ${ay} ${yil}, ${saat}:${dakika}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        console.log('Siparişler yükleniyor...');
        
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date()
          };
        }) as Order[];

        console.log('Yüklenen siparişler:', ordersData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Sipariş yükleme hatası:', err);
        setError('Siparişler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <TruckIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Hazırlanıyor';
      case 'failed':
        return 'Başarısız';
      default:
        return status;
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Siparişlerim
          </button>
        </nav>
      </div>

      {activeTab === 'profile' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta</label>
              <p className="mt-1 text-sm text-gray-900">{currentUser?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kullanıcı ID</label>
              <p className="mt-1 text-sm text-gray-900">{currentUser?.uid}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Siparişlerim</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sipariş Bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">Henüz hiç sipariş vermediniz.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Sipariş Başlığı */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Sipariş #{order.id.slice(-6)}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className={`ml-2 text-sm font-medium ${
                        order.status === 'completed' ? 'text-green-700' :
                        order.status === 'pending' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Sipariş Ürünleri */}
                  <div className="border-t border-b border-gray-200 -mx-6 px-6 py-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center py-4 first:pt-0 last:pb-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.quantity} adet x {item.price.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {(item.quantity * item.price).toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Sipariş Özeti */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">Toplam Tutar</span>
                      <span className="font-bold text-purple-600">
                        {order.totalAmount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  {/* Teslimat Bilgileri */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Teslimat Adresi</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.district} / {order.shippingAddress.city}
                      <br />
                      {order.shippingAddress.postalCode}
                      <br />
                      Tel: {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile; 