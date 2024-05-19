import React, { useState } from "react";
import Modal from "react-modal"; // Import the modal library
import axios from "axios"; // Import Axios for HTTP requests
import dummyData from "../../dummyData"; // Import dummy data
import "./Products.css"; // Importing the CSS file

const Products = () => {
  const [product, setProduct] = useState({id:"",name:"",description:"",price:"",quantity:"",time:"",encryptedName:"",encryptedDescription:"",encryptedPrice:"",encryptedQuantity:""}); // State for products



  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async() => {

    const response = await axios.get(`http://localhost:8082/api/products/searchProducts?productId=${searchTerm}&userId=${localStorage.getItem("id")}`);
    console.log(response);
    const data = response.data;
    const newProduct={id:data[0],name:data[1],description:data[2],price:data[3],quantity:data[4],time:data[9],encryptedName:data[5],encryptedDescription:data[6],encryptedPrice:data[7],encryptedQuantity:data[8]};
    setProduct(newProduct);

  };
  return (
    <div>
      <h2>products</h2>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by id"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>price</th>
            <th>quantity</th>
            <th>time - MS</th>
          </tr>
        </thead>
        <tbody>

              <tr>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>{product.time}</td>
            </tr>

        </tbody>
      </table>
      <div className="Encrypted">
      <h3>Encrypted product details: </h3>
      <h4>Product Name: </h4>
      <th>{product.encryptedName}</th>
      <h4>Product Description: </h4>
      <th>{product.encryptedDescription}</th>
      <h4>Product Price: </h4>
      <th>{product.encryptedPrice}</th>
      <h4>Product Quantity: </h4>
      <th>{product.encryptedQuantity}</th>
      </div>
    </div>
  );
};

export default Products;
