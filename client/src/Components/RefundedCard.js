import React from 'react';
import '../Style/cartcard.css';
import { useNavigate } from 'react-router-dom';

const RefundedCard = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = (item) => {
    navigate('/productPage', { state: { product: item } });
  };


  return (
    <div className='product-cart'>
      <div className='card' onClick={() => handleProductClick(product.product)}>
        <img src={product.product.thumbnail} alt="product" />
        <div className='card-2'>
          <h3>{product.product.title}</h3>
          <h3>{product.product.price}</h3>
        </div>
      </div>
    </div>
  );
};

export default RefundedCard;
