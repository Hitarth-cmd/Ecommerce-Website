import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Style/productPage.css';

const ProductPage = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { product } = location.state || {};

    console.log("pro -> " ,product);

    if (!product) {
        return <p>No product data available</p>;
    }

    const paymentHandler = async () => {
        const token = localStorage.getItem('token');
        if(!token)
        {
            alert("Please login first");
            return ;
        }

        try {
            const keyResponse = await fetch("http://localhost:8080/api/v1/getkey");
            const { key_id } = await keyResponse.json();
            console.log('Key Data:', key_id);
    
            const requestBody = {
                amount: Number(product.price) || 1,
                currency: "INR",
                receipt: "Receipt no. 1"
            };
    
            const checkoutResponse = await fetch("http://localhost:8080/api/v1/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
    
            if (!checkoutResponse.ok) {
                const err = await checkoutResponse.json().catch(() => ({}));
                throw new Error(err.message || `Checkout failed: ${checkoutResponse.status}`);
            }
            const checkoutData = await checkoutResponse.json();
            //console.log('Checkout Data:', checkoutData);

            // const token = localStorage.getItem('token');
            //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Ijg3Mjg4NTM1NTQiLCJhY2NvdW50VHlwZSI6IkN1c3RvbWVyIiwiaWQiOiI2NjlkMGViMzYxZGY5OWUzMDc1N2IyZmMiLCJpYXQiOjE3MjE1Njg5NTMsImV4cCI6MTcyMTU4MzM1M30.xbRGqhboXQDENg1_Yj2LeGymBRXCmEwlsJx95tGrSQY"

            const options = {
                key: key_id,
                amount: checkoutData.paymentResponse.amount,
                currency: "INR",
                name: "Sagar ray",
                description: "Test Mode",
                order_id: checkoutData.paymentResponse.id,
                handler: async (response) => {
                    console.log("response", response)
                    try {
                        const res = await fetch(`http://localhost:8080/api/v1/paymentverification`, {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                product,
                                token:token,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                        })
        
                        const verifyData = await res.json();
        
                        if (verifyData && verifyData.success) {
                            console.log("Payment verified successfully on FE");
                            navigate(`/paymentsuccess?reference=${verifyData.reference || response.razorpay_payment_id}`);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
                theme: {
                    color: "#5f63b8"
                }
            };
            if (!window.Razorpay) {
                alert("Razorpay SDK failed to load. Check your network.");
                return;
            }
            const rzp1 = new window.Razorpay(options);
            rzp1.open();


            // const options = {
            //     key: key_id,
            //     amount: checkoutData.paymentResponse.amount,
            //     currency: "INR",
            //     name: "Sagar Ray",
            //     description: "Tutorial of RazorPay",
            //     image: "https://avatars.githubusercontent.com/u/107414907?v=4",
            //     order_id: checkoutData.paymentResponse.id,
            //     callback_url: "http://localhost:8080/api/v1/paymentverification",
            //     prefill: {
            //         name: "Gaurav Kumar",
            //         email: "gaurav.kumar@example.com",
            //         contact: "9999999999"
            //     },
            //     notes: {
            //         "address": "Razorpay Corporate Office"
            //     },
            //     theme: {
            //         "color": "#121212"
            //     }
            // };
            
            // const razor = new window.Razorpay(options);
            // razor.open();

        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const addToCartHandler = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first");
            return;
        }
    
        try {
            const res = await fetch('http://localhost:8080/api/v1/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product, token })
            });
    
            if (!res.ok) {
                throw new Error(`Failed to add to cart: ${res.status}`);
            }
    
            const data = await res.json();
            console.log("Product added to cart successfully:", data);
            alert("Product added to cart successfully");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to add product to cart. Please try again later.");
        }
    }
    

    return (
        <div className='product-page'>
            <div className='product-page-1'>
                <img src={product.thumbnail} alt="thumbnail" />
                <div className='images'>
                    {product.images.map((image, index) => (
                        <img key={index} src={image} alt={`product-img-${index}`} />
                    ))}
                </div>
            </div>
            <div className='product-page-2'>
                <div className='info-1'>
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <h3>{product.rating} rating</h3>
                </div>
                <div className='info-2'>
                    <h2>Price {product.price}</h2>
                    <h2>{product.discountPercentage} discount</h2>
                </div>
                <div className='info-3'>
                    <h2>
                        only {product.stock} left! 
                        don't miss it
                    </h2>
                    <div className='buttons'>
                        <button onClick={paymentHandler}>Buy Now</button>
                        <button onClick={addToCartHandler}>Add to Cart</button>
                    </div>
                </div>
                <div className='info-4'>
                    <div>
                        <h2>Free delivery</h2>
                        <p>Enter your postal code for free delivery</p>
                    </div>
                    <div>
                        <h2>Return delivery</h2>
                        <p>Enter your postal code for free delivery</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
