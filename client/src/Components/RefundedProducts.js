import React, { useEffect, useState } from 'react'
import '../Style/cart.css';
import OrderedProductCard from './OrderedProductCard';
import RefundedCard from './RefundedCard';
import { useNavigate } from 'react-router-dom';

const RefundedProducts = () => {
    const [data,setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchData = async (req,res) => {
        const token = localStorage.getItem('token');
        if(!token){
            alert("Login first");
            navigate('/');
            return ;
        }

        try{
            const res = await fetch("http://localhost:8080/api/v1/refundedproducts",{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                body: JSON.stringify({ token })
            })

            if (!res.ok) {
                throw new Error(`Failed to fetch Refunded items: ${res.status}`);
              }
      
              const data = await res.json();
              //console.log(data.orderedProducts);
              setData(data.refundedProducts);
              setLoading(false);
              //console.log("length ", data.data);
        }
        catch(error){
            console.error("Error:", error);
            alert("Failed to load Refunded items. Please try again later.");
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchData();
    },[]);

    
      return (
        <div className='cart-cart'>
          {
            isLoading ? (
              <h1>.....Loading !!!</h1>
            ) : (
              data && data.length > 0 ? (
                <div className='products-container'>
                  {data.map(item => (
                    <div className='product-item'>
                        <RefundedCard key={item.id} product={item}/>
                    </div>
                  ))}
                </div>
              ) : (
                <h1>Your Refunded list is empty</h1>
              )
            )
          }
        </div>
      );
}

export default RefundedProducts