import React, { useState } from "react";
import Modal from "react-modal"; // Import the modal library
import axios from "axios"; // Import Axios for HTTP requests
import dummyData from "../../dummyData"; // Import dummy data
import "./Products.css"; // Importing the CSS file
import AddProductForm from "./AddProductForm";

const Products = () => {
  const [product, setProduct] = useState({id:"",name:"",description:"",price:"",quantity:"",time:""}); // State for products
  const [products, setProducts] = useState([]); // State for products
  // State declarations
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSearch = async() => {
    const response = await axios.get(`http://localhost:8082/api/products/searchProducts?productId=${searchTerm}&userId=${localStorage.getItem("id")}`);
    console.log(response);
    const data = response.data;
    const newProduct={id:data[0],name:data[1],description:data[2],price:data[3],quantity:data[4],time:data[9]};
    setProduct(newProduct);
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8082/api/products/delete/${id}/true`);
      alert(`Product '${id}' deleted`);
      //setproducts(filtered);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleViewAllProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/products/all?isAdmin=true`);
        const data = response.data;
        setProducts([...data]);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };
  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };
  const handleSubmitProduct = async(newProduct) => {
    try {
      const queryParams = `?name=${newProduct.name}&description=${newProduct.description}&price=${newProduct.price}&quantity=${newProduct.quantity}&isAdmin=true`;
      const response = await axios.post(`http://localhost:8082/api/products/add${queryParams}`);
      console.log(response);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
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
                <button
                  className="delete-button"
                  onClick={() => {
                    handleDelete(product.id);
                  }}
                >
                  Delete
                </button>
        </tbody>

    <div>
        <button className="add-button" onClick={handleAddProduct}>
          Add New Product
        </button>
      </div>
    <div>
        <button className="viewAll-button" onClick={handleViewAllProduct}>
         View All Products
        </button>
      </div>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>price</th>
            <th>quantity</th>
          </tr>
        </thead>
        <tbody>
            {products.map((p)=>(
                        <tr key={p.id} >

                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>{p.price}</td>
                                <td>{p.quantity}</td>
                        </tr>))}


        </tbody>


      </table>

      <Modal
        isOpen={showAddForm}
        onRequestClose={handleCloseAddForm}
        className="add-product-modal"
        overlayClassName="modal-overlay"
      >

               <AddProductForm
                onSubmit={handleSubmitProduct}
                onClose={handleCloseAddForm}
                />
             </Modal>
    </div>
  );
};

export default Products;
