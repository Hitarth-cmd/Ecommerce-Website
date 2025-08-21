import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../Style/searchedproduct.css'

const SearchedProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { productData } = location.state || {};

    const handleProductClick = (item) => {
        navigate('/productPage', { state: { product: item } });
    };

    return (
        <div>
            <h1>Searched Results</h1>
            <div className='products-container'>
                {productData ? (
                    productData.map((item) => (
                        <div key={item.id} className='product-item' onClick={() => handleProductClick(item)}>
                            <ProductCard product={item} />
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
}

export default SearchedProduct;
