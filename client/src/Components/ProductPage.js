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
            console.log("Starting payment process...");
            
            // Try deployed backend first, fallback to localhost if needed
            let backendUrl = "https://ecom-website-beige.vercel.app";
            let key_id = null;
            let orderData = null;

            try {
                // First attempt: Get Razorpay key from deployed backend
                console.log("Trying deployed backend...");
                const keyResponse = await fetch(`${backendUrl}/api/v1/getkey`);
                
                if (keyResponse.ok) {
                    const keyData = await keyResponse.json();
                    key_id = keyData.key_id;
                    console.log('Key received from deployed backend:', key_id);
                } else {
                    throw new Error('Deployed backend key fetch failed');
                }

                // Create order on deployed backend
                const requestBody = {
                    amount: Number(product.price) || 1,
                    currency: "INR",
                    receipt: "Receipt no. 1"
                };

                const checkoutResponse = await fetch(`${backendUrl}/api/v1/checkout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                });

                if (checkoutResponse.ok) {
                    orderData = await checkoutResponse.json();
                    console.log('Order created on deployed backend:', orderData);
                } else {
                    throw new Error('Deployed backend order creation failed');
                }

            } catch (deployedError) {
                console.log("Deployed backend failed, trying localhost...", deployedError);
                
                // Fallback to localhost
                backendUrl = "http://localhost:8080";
                
                try {
                    const keyResponse = await fetch(`${backendUrl}/api/v1/getkey`);
                    if (keyResponse.ok) {
                        const keyData = await keyResponse.json();
                        key_id = keyData.key_id;
                        console.log('Key received from localhost:', key_id);
                    } else {
                        throw new Error('Localhost key fetch failed');
                    }

                    const requestBody = {
                        amount: Number(product.price) || 1,
                        currency: "INR",
                        receipt: "Receipt no. 1"
                    };

                    const checkoutResponse = await fetch(`${backendUrl}/api/v1/checkout`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestBody)
                    });

                    if (checkoutResponse.ok) {
                        orderData = await checkoutResponse.json();
                        console.log('Order created on localhost:', orderData);
                    } else {
                        throw new Error('Localhost order creation failed');
                    }

                } catch (localhostError) {
                    console.error("Both backends failed:", localhostError);
                    throw new Error('Unable to connect to payment server. Please try again later.');
                }
            }

            if (!key_id || !orderData) {
                throw new Error('Failed to get payment credentials');
            }

            // Ensure amount is in paise (Razorpay requirement)
            const amountInPaise = Math.round((Number(product.price) || 1) * 100);

            const options = {
                key: key_id,
                amount: amountInPaise,
                currency: "INR",
                name: "E-commerce Store",
                description: `Purchase: ${product.title}`,
                order_id: orderData.paymentResponse?.id || orderData.id,
                handler: async (response) => {
                    console.log("Payment response received:", response);
                    try {
                        const verificationBody = {
                            product,
                            token: token,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const res = await fetch(`${backendUrl}/api/v1/paymentverification`, {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(verificationBody)
                        });

                        if (res.ok) {
                            const verifyData = await res.json();
                            if (verifyData && verifyData.success) {
                                console.log("Payment verified successfully!");
                                navigate(`/paymentsuccess?reference=${verifyData.reference || response.razorpay_payment_id}`);
                            } else {
                                alert("Payment verification failed. Please contact support.");
                            }
                        } else {
                            console.error("Verification request failed:", res.status);
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Payment verification failed. Please try again.");
                    }
                },
                prefill: {
                    name: "Customer",
                    email: "customer@example.com",
                    contact: ""
                },
                notes: {
                    address: "E-commerce Store",
                    product_id: product.id,
                    product_name: product.title
                },
                theme: {
                    color: "#5f63b8"
                },
                modal: {
                    ondismiss: function() {
                        console.log("Payment modal closed");
                    }
                }
            };
            
            console.log("Opening Razorpay with options:", options);
            
            if (!window.Razorpay) {
                alert("Razorpay SDK failed to load. Please refresh the page and try again.");
                return;
            }
            
            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert(`Payment Error: ${error.message}`);
        }
    };
    
    const addToCartHandler = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login first");
            return;
        }
    
        try {
            // Try deployed backend first, fallback to localhost
            let backendUrl = "https://ecom-website-beige.vercel.app";
            
            try {
                const res = await fetch(`${backendUrl}/api/v1/addtocart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product, token })
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Product added to cart successfully:", data);
                    alert("Product added to cart successfully");
                    return;
                }
            } catch (error) {
                console.log("Deployed backend failed, trying localhost...");
            }

            // Fallback to localhost
            const res = await fetch('http://localhost:8080/api/v1/addtocart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product, token })
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Product added to cart successfully:", data);
                alert("Product added to cart successfully");
            } else {
                throw new Error(`Failed to add to cart: ${res.status}`);
            }
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
