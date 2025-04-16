import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`}>
        <div className="relative w-full min-h-80 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className={`
              w-full h-full object-center object-cover 
              transition-all duration-300 ease-out
              ${isHovered ? 'scale-110 filter brightness-90' : 'scale-100'}
            `}
          />
          {/* Geliştirilmiş Büyüteç İkonu Overlay */}
          <div className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="bg-white bg-opacity-90 p-3 rounded-full transform transition-transform duration-300 hover:scale-110">
              <MagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <p className="text-gray-500 line-clamp-2">{description}</p>
          <p className="text-xl font-bold text-purple-600">
            {price.toLocaleString('tr-TR')} ₺
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 