import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../config/firebase';

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface OrderDetails {
  userId: string;
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
  totalAmount: number;
  paymentMethod: 'credit_card';
}

// Kredi kartı numarası kontrolü için Luhn algoritması
const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitizedNumber = cardNumber.replace(/\s/g, '');
  return /^[0-9]{16}$/.test(sanitizedNumber);
};

// CVV kontrolü
const isValidCVV = (cvv: string): boolean => {
  return /^[0-9]{3}$/.test(cvv);
};

// Son kullanma tarihi kontrolü
const isValidExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split('/');
  if (!month || !year) return false;
  
  const currentDate = new Date();
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  
  return expiry > currentDate;
};

// Ödeme işlemi
export const processPayment = async (
  paymentDetails: PaymentDetails,
  orderDetails: Omit<OrderDetails, 'status' | 'createdAt'>
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    // Kart validasyonları
    if (!isValidCreditCard(paymentDetails.cardNumber)) {
      throw new Error('Geçersiz kredi kartı numarası');
    }
    if (!isValidCVV(paymentDetails.cvv)) {
      throw new Error('Geçersiz CVV');
    }
    if (!isValidExpiryDate(paymentDetails.expiryDate)) {
      throw new Error('Geçersiz son kullanma tarihi');
    }

    // Sipariş referansını transaction dışında oluştur
    const orderRef = doc(collection(db, 'orders'));
    const orderId = orderRef.id;

    // Stok kontrolü ve güncelleme işlemi
    await runTransaction(db, async (transaction) => {
      // Her ürün için stok kontrolü
      for (const item of orderDetails.items) {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error(`Ürün bulunamadı: ${item.name}`);
        }

        const productData = productDoc.data();
        const currentStock = productData.stock;

        if (currentStock < item.quantity) {
          throw new Error(`${item.name} için yeterli stok yok. Mevcut stok: ${currentStock}`);
        }

        // Stok güncelleme
        transaction.update(productRef, {
          stock: currentStock - item.quantity
        });
      }

      // Sipariş oluşturma
      transaction.set(orderRef, {
        ...orderDetails,
        id: orderId, // Sipariş ID'sini kaydet
        status: 'completed',
        createdAt: serverTimestamp(),
        paymentDetails: {
          cardName: paymentDetails.cardName,
          lastFourDigits: paymentDetails.cardNumber.slice(-4)
        }
      });
    });

    console.log('Sipariş ve stok güncelleme başarılı, Sipariş ID:', orderId);

    return {
      success: true,
      orderId: orderId
    };

  } catch (error) {
    console.error('Ödeme/stok güncelleme hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'İşlem sırasında bir hata oluştu'
    };
  }
};

// Yardımcı fonksiyonları da export et
export const paymentUtils = {
  isValidCreditCard,
  isValidCVV,
  isValidExpiryDate
}; 