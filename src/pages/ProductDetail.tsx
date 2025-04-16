import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ImageMagnifier from '../components/ImageMagnifier';

interface Comment {
  id: string;
  text: string;
  rating: number;
  userId: string;
  userName: string;
  createdAt: Date;
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
  const { currentUser, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ürün bilgilerini getir
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError('Ürün bulunamadı');
        }
      } catch (err) {
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

    const q = query(
      collection(db, 'comments'),
      where('productId', '==', id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as Comment[];
      setComments(commentsList);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    if (!newComment.trim()) {
      setError('Yorum boş olamaz');
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        productId: id,
        text: newComment,
        rating,
        userId: currentUser?.uid,
        userName: currentUser?.displayName || currentUser?.email?.split('@')[0],
        createdAt: new Date()
      });

      setNewComment('');
      setRating(5);
      setError('');
    } catch (err) {
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

          {/* Yorum Formu */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mt-8 border-t border-gray-200 pt-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Yorum Yap</h3>
                <div className="mt-4">
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Bu ürün hakkında ne düşünüyorsunuz?"
                  />
                </div>
                <div className="mt-4">
                  <label className="text-sm text-gray-700">Puan</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Yıldız
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Yorum Yap
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                Yorum yapmak için lütfen{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-500">
                  giriş yapın
                </a>
              </p>
            </div>
          )}

          {/* Yorumlar Listesi */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900">Yorumlar</h3>
            <div className="mt-6 space-y-6">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">Henüz yorum yapılmamış</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900">{comment.userName}</h4>
                        <div className="mt-1 flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`h-5 w-5 ${
                                index < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.585l-7.07 4.267 1.857-7.819L0 7.383l7.714-.964L10 0l2.286 6.42 7.714.964-4.787 4.65 1.857 7.819z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }).format(comment.createdAt)}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 