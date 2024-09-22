import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductItem;
