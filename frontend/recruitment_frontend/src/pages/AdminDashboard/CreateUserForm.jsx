import React, { useState } from "react";
import axios from "axios";
import "./CreateUserForm.css";

const CreateUserForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear old message
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/users/create/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setMessage("User created successfully!");
      setMessageType("success");
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "candidate",
      });

      setTimeout(() => {
        onSuccess(); // Notify parent to refresh and close
      }, 1500);
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage("Failed to create user. Please check the data and try again.");
      setMessageType("error");
    }
  };

  return (
    <form className="create-user-form" onSubmit={handleSubmit}>
      <h2>Create New User</h2>

      {message && (
        <div className={`form-message ${messageType}`}>{message}</div>
      )}

      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="lastname"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="candidate">Candidate</option>
        <option value="hr">HR</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateUserForm;
