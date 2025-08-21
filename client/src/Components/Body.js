import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import video from "../assest/videoplayback.webm";
import '../Style/body.css';
import ProductCard from './ProductCard';

const Body = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        const pro = await fetch('https://dummyjson.com/products');
        const json = await pro.json();
        setData(json.products);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleProductClick = (item) => {
        navigate('/productPage', { state: { product: item } });
    };

    const handleBuyNowFromCard = async (item) => {
        const token = localStorage.getItem('token');
        if(!token){
            alert('Please login first');
            navigate('/login');
            return;
        }
        try{
            const keyResponse = await fetch('http://localhost:8080/api/v1/getkey');
            const { key_id } = await keyResponse.json();

            const checkoutRes = await fetch('http://localhost:8080/api/v1/checkout',{
                method:'POST',
                headers:{ 'Content-Type':'application/json' },
                body: JSON.stringify({ amount: Number(item.price) || 1, currency:'INR', receipt:'Receipt no. 1'})
            });
            if(!checkoutRes.ok){
                const err = await checkoutRes.json().catch(()=> ({}));
                throw new Error(err.message || `Checkout failed: ${checkoutRes.status}`);
            }
            const checkoutData = await checkoutRes.json();

            if(!window.Razorpay){
                alert('Razorpay SDK failed to load.');
                return;
            }
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
                            method:'POST',
                            headers:{ 'content-type':'application/json', 'Authorization': `Bearer ${token}` },
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
        <div className='body'>
            <div className='content-video'>
                <div className='content-video-1'>
                    <img src="https://c8.alamy.com/comp/2KKFMED/stylish-man-cartoon-male-characters-men-in-fashion-clothes-flat-style-vector-illustration-2KKFMED.jpg">
                    </img>
                </div>
                <video
                    src={video}
                    autoPlay
                    muted
                    loop
                >
                </video>
            </div>
            <div className='products'>
                <h1>Headphones for you</h1>
                <div className='products-container'>
                    {data ? (
                        data.map((item) => (
                            <div key={item.id} className='product-item'>
                                <ProductCard product={item} onView={handleProductClick} onBuyNow={handleBuyNowFromCard} />
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p> // Fallback UI
                    )}
                </div>
            </div>
        </div>
    )
}

export default Body;
