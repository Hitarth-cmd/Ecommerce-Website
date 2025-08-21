import React, { useState, useEffect } from 'react';
import CartCard from './CartCard';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login first");
        navigate('/');
        return ;
      }

      try {
        const res = await fetch('http://localhost:8080/api/v1/showcartitems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ token })
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch cart items: ${res.status}`);
        }

        const data = await res.json();
       // console.log(data.data);
        setData(data.data);
        setLoading(false);
        //console.log("length ", data.data);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to load cart items. Please try again later.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = (productId) => {
    setData(data.filter(item => (item.id || item._id) !== productId));
  };

  return (
    <div className='cart-cart'>
      {
        loading ? (
          <h1>.....Loading !!!</h1>
        ) : (
          data && data.length > 0 ? (
            <div className='products-container'>
              {data.map(item => (
                <div className='product-item'>
                    <CartCard key={item.id} product={item} removeFromCart={removeFromCart}/>
                </div>
              ))}
            </div>
          ) : (
            <h1>Your cart is empty</h1>
          )
        )
      }
    </div>
  );
};

export default Cart;

