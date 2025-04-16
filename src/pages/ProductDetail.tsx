import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ImageMagnifier from '../components/ImageMagnifier';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Comment {
  id: string;
  text: string;
  rating: number;
  userId: string;
  userName: string;
  createdAt: Timestamp;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  // Ürün bilgilerini getir
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError('Ürün bulunamadı');
        }
      } catch (err) {
        console.error('Ürün yükleme hatası:', err);
        setError('Ürün yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Yorumları gerçek zamanlı olarak getir
  useEffect(() => {
    if (!id) return;

    console.log('Yorumlar yükleniyor...');
    const q = query(
      collection(db, 'comments'),
      where('productId', '==', id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const commentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        console.log('Yüklenen yorumlar:', commentsList);
        setComments(commentsList);
      },
      (error) => {
        console.error('Yorum yükleme hatası:', error);
        setError('Yorumlar yüklenirken bir hata oluştu');
      }
    );

    return () => unsubscribe();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !currentUser) {
      setError('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    if (!newComment.trim()) {
      setError('Yorum boş olamaz');
      return;
    }

    try {
      const commentData = {
        productId: id,
        text: newComment,
        rating,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonim',
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'comments'), commentData);
      console.log('Yorum başarıyla eklendi');
      setNewComment('');
      setRating(5);
      setError('');
    } catch (err) {
      console.error('Yorum ekleme hatası:', err);
      setError('Yorum eklenirken bir hata oluştu');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      }, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Yorum silme fonksiyonu
  const handleDeleteComment = async (commentId: string) => {
    if (!isAdmin) {
      console.log('Silme yetkisi yok');
      return;
    }

    try {
      await deleteDoc(doc(db, 'comments', commentId));
      console.log('Yorum başarıyla silindi');
    } catch (err) {
      console.error('Yorum silme hatası:', err);
      setError('Yorum silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Ürün bulunamadı'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Ürün Resmi - Büyüteç ile */}
          <div className="aspect-w-1 aspect-h-1">
            {product && (
              <ImageMagnifier
                src={product.imageUrl}
                alt={product.name}
              />
            )}
          </div>

          {/* Ürün Detayları */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <p className="text-xl font-bold text-purple-600">
              {product.price.toLocaleString('tr-TR')} ₺
            </p>
            
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Adet:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Stok Durumu:</span>
                <span className={`px-2 py-1 text-sm font-semibold rounded ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} adet` : 'Tükendi'}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 px-8 rounded-md text-white text-sm font-medium 
                  ${product.stock > 0 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                  } transition-colors duration-200`}
              >
                {product.stock > 0 ? 'Sepete Ekle' : 'Ürün Tükendi'}
              </button>

              {addedToCart && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                  Ürün sepete eklendi!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Ürün Bilgileri */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Ürün bilgileri</h2>
            <p className="text-3xl text-gray-900">{product.price.toLocaleString('tr-TR')} ₺</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Açıklama</h3>
            <div className="text-base text-gray-700">{product.description}</div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <div className="text-sm text-gray-500">
                Stok Durumu: <span className="font-medium text-gray-900">{product.stock}</span>
              </div>
            </div>
          </div>

          {/* Yorumlar Bölümü */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Yorumlar</h2>
              {isAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Admin Modu
                </span>
              )}
            </div>

            {/* Yorum Formu */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                      Puanlama
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                      Yorumunuz
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Yorum Yap
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8">
                <p className="text-yellow-700">
                  Yorum yapmak için lütfen giriş yapın.
                </p>
              </div>
            )}

            {/* Yorumlar Listesi */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {comment.userName}
                      </span>
                      <div className="flex text-yellow-400">
                        {[...Array(comment.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {comment.createdAt instanceof Timestamp 
                          ? comment.createdAt.toDate().toLocaleDateString('tr-TR')
                          : new Date().toLocaleDateString('tr-TR')}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                          title="Yorumu sil"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 text-center">
                  Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 