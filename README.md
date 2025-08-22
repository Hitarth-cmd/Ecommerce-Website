E-Commerce Web Application
==========================

This is an e-commerce web application built with React.js, Node.js, and Express.js. The application includes features like user authentication, product search, cart management, and handling of ordered and refunded products.

Features
--------

*   **User Authentication**: Secure login and signup functionality.
    
*   **Product Search**: Search products and view product details.
    
*   **Cart Management**: Add and remove products from the cart.
    
*   **Order Management**: View ordered and refunded products.
    
*   **Responsive Design**: Fully responsive layout for all devices.
    

Tech Stack
----------

*   **Frontend**: React.js, Redux Toolkit
    
*   **Backend**: Node.js, Express.js, Razorpay
    
*   **Database**: Supabase (PostgreSQL)
    
*   **Styling**: CSS, CSS Modules
    
*   **Deployment**: Vercel
    

Getting Started
---------------

### Prerequisites

*   Node.js
    
*   npm or yarn
    
*   Supabase account
    

### Installation

1.  ```bash
    git clone https://github.com/roy7077/payment-gateway.git
    cd ecommerce-app
    ```
    
2.  ```bash
    cd server
    npm install
    ```
    
3.  ```bash
    cd ../client
    npm install
    ```
    
4.  ```bash
    cd ..
    npm install
    ```

### Environment Variables

Create a `.env` file in the server directory and add the following environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Running the Application

1.  ```bash
    cd server
    npm start
    ```
    
2.  ```bash
    cd ../client
    npm start
    ```
    
3.  Or run both simultaneously from root:
    ```bash
    npm run dev
    ```

## Deployment

### Deploy to Vercel

This application is configured for easy deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment:
```bash
npm i -g vercel
npm run install-all
npm run build
vercel
```

API Endpoints
-------------

### Authentication

*   **POST** /api/v1/signup - Register a new user
    
*   **POST** /api/v1/login - Authenticate user and get token
    

### Payment

*   **GET** /api/v1/getkeyid - Get Razorpay Key ID
    
*   **POST** /api/v1/capturepayment - Capture payment
    
*   **POST** /api/v1/refundpayment - Refund payment
    
*   **GET** /api/v1/fetchallpayments - Fetch all payments
    
*   **GET** /api/v1/getpaymentdetails/:id - Get payment details by ID
    
*   **GET** /api/v1/fetchcarddetails - Fetch card details
    
*   **POST** /api/v1/paymentverification - Verify payment

POSTMAN LINK - https://www.postman.com/roy707/workspace/shop-cart/collection/32632569-0177389f-3ffc-4d24-a8bb-9c869782bc67?action=share&creator=32632569

### Cart Management

*   **POST** /api/v1/addtocart - Add product to cart
    
*   **DELETE** /api/v1/removefromcart - Remove product from cart
    
*   **POST** /api/v1/showcartitems - Show all cart items
    

### Order Management

*   **POST** /api/v1/orderedproducts - Show all ordered products
    
*   **POST** /api/v1/refundedproducts - Show all refunded products

### DB Schema
<img width="928" alt="Ecommerce_DB" src="https://github.com/user-attachments/assets/c8e92ab8-3088-4f8a-902e-35a5d62f8fa7">

Contribution
------------

Feel free to submit issues or pull requests if you have suggestions or improvements.

License
-------

This project is licensed under the MIT License.
