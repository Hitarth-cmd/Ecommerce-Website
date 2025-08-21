import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import SearchedProduct from './Components/SearchedProduct';
import Body from './Components/Body'; // Assuming you have a Home component
import ProductPage from './Components/ProductPage';
import PaymentSuccess from './Components/PaymentSuccess';
import { Provider } from 'react-redux';
import Store from "./utils/Store";
import useOnline from './Components/useOnline'
import Offline from './Components/Offline';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Cart from './Components/Cart';
import './App.css'
import OrderedProducts from './Components/OrderedProducts';
import RefundedProducts from './Components/RefundedProducts';
import Profile from './Components/Profile';


const App = () => {
    const online=useOnline();

  if(!online)
  return <Offline/>

    return (
        <Provider store={Store}>
            <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/searchedProduct" element={<SearchedProduct />} />
                <Route path="/productPage" element={<ProductPage />} />
                <Route path="/paymentsuccess" element={<PaymentSuccess />} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/cart" element={<Cart/>} />
                <Route path="/orderedproducts" element={<OrderedProducts/>} />
                <Route path="/refundedproducts" element={<RefundedProducts/>} />
                <Route path="/profile" element={<Profile/>} />
            </Routes>
           </Router>
        </Provider>
    );
}

export default App;
