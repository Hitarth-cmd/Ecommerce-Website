import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Style/paymentsuccess.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const reference = searchParams.get('reference');

    return (
        <div>
            <h1>Payment Successful</h1>
            {reference ? (
                <p>Your payment reference is: {reference}</p>
            ) : (
                <p>No reference available.</p>
            )}
        </div>
    );
}

export default PaymentSuccess;
