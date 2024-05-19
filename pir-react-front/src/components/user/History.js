import React, { useState } from "react";
import Modal from "react-modal"; // Import the modal library
import axios from "axios"; // Import Axios for HTTP requests
import dummyData from "../../dummyData"; // Import dummy data
import "./Products.css"; // Importing the CSS file

const History = () => {
  const [products, setProducts] = useState([]); // State for products



  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async() => {

    const response = await axios.get(`http://localhost:8082/api/search/history/${localStorage.getItem("id")}`);
    console.log(response.data);
    const data = response.data;
    //const newProduct={id:data[0],name:data[1],description:data[2],price:data[3],quantity:data[4],time:data[9],encryptedProduct:data[5]};
    setProducts([...data]);

  };
  return (
    <div>
      <h2>History</h2>
      <div className="search-container">
        <button className="search-button" onClick={handleSearch}>
          View History
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Response Time - MS</th>
          </tr>
        </thead>
        <tbody>
            {products.map(p=>
                        <tr key={p.id} >

                                <td   >{p.productId}</td>
                                 <td  >{p.productName}</td>
                                <td >{p.responseTime}</td>
                        </tr>)}


        </tbody>
      </table>

    </div>
  );
};

export default History;
