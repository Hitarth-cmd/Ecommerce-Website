import React from 'react';
import '../Style/cartcard.css';
import { useNavigate } from 'react-router-dom';

const CartCard = ({ product, removeFromCart }) => {
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
      const res = await fetch('http://localhost:8080/api/v1/removefromcart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: product.id || product._id, token })
      });

      if (!res.ok) {
        throw new Error(`Failed to remove cart items: ${res.status}`);
      }

      removeFromCart(product._id);
      // No need to navigate to /cart as we are already on that page
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to remove cart items. Please try again later.");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      return;
    }
    const item = product.product;
    try{
      const keyResponse = await fetch('http://localhost:8080/api/v1/getkey');
      const { key_id } = await keyResponse.json();
      const checkoutRes = await fetch('http://localhost:8080/api/v1/checkout',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ amount: Number(item.price) || 1, currency:'INR', receipt:'Receipt no. 1'})
      });
      if(!checkoutRes.ok){
        const err = await checkoutRes.json().catch(()=> ({}));
        throw new Error(err.message || `Checkout failed: ${checkoutRes.status}`);
      }
      const checkoutData = await checkoutRes.json();
      const rzp = new window.Razorpay({
        key: key_id,
        amount: checkoutData.paymentResponse.amount,
        currency: 'INR',
        name: 'E-commerce',
        description: 'Buy Now',
        order_id: checkoutData.paymentResponse.id,
        handler: async (response) => {
          try{
            const res = await fetch('http://localhost:8080/api/v1/paymentverification',{
              method:'POST', headers:{'content-type':'application/json','Authorization':`Bearer ${token}`},
              body: JSON.stringify({ product: item, token, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature })
            });
            const verify = await res.json();
            if(verify && verify.success){
              navigate(`/paymentsuccess?reference=${verify.reference || response.razorpay_payment_id}`);
            }
          }catch(err){ console.error(err); }
        },
        theme: { color: '#5f63b8' }
      });
      rzp.open();
    }catch(err){
      console.error(err);
      alert(err.message || 'Payment init failed');
    }
  }

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
        <h2 onClick={handleRemove}>Remove <i className="ri-delete-bin-line"></i></h2>
        <h2 onClick={handleBuyNow}>Buy Now <i className="ri-flashlight-line"></i></h2>
      </div>
    </div>
  );
};

export default CartCard;
