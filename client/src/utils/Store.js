import { configureStore } from '@reduxjs/toolkit';
import Cartslice from './Cartslice';

const Store= configureStore({
    
    reducer:{
        cart:Cartslice,
    },
})

export default Store;