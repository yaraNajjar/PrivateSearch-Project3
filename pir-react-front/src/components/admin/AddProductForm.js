import React, { useState } from "react";
import "./AddProductForm.css"; // Import your CSS file

const AddProductForm = ({ onSubmit, onClose }) => {
  // State declarations for form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, price, quantity });
    // Reset the form input values
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    onClose();

  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="exit-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div className="modal-footer">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Exit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
