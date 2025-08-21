import React from 'react';
import '../Style/cartcard.css';
import { useNavigate } from 'react-router-dom';

const OrderedProductCard = ({ product, removeFromCart }) => {
  const navigate = useNavigate();

  const handleProductClick = (item) => {
    navigate('/productPage', { state: { product: item } });
  };

  const handleRemove = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/v1/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: product.id || product._id, token })
      });

      if (!res.ok) {
        throw new Error(`Failed to refund item: ${res.status}`);
      }

      removeFromCart(product._id);
      // No need to navigate to /cart as we are already on that page
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to remove cart items. Please try again later.");
    }
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
      <div>
        <h2 onClick={handleRemove}>Refund <i className="ri-delete-bin-line"></i></h2>
      </div>
    </div>
  );
};

export default OrderedProductCard;
