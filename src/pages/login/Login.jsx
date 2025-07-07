import React, { useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Optional, for reading cookies

const LoginPage = () => {
  // State for form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // Initialize navigation hook
  const API_URL2 = process.env.REACT_APP_API_URL;
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form before submitting
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      // Send API request
      const response = await fetch(`${API_URL2}/api/admin/loginforadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
        credentials: "include", // Ensures cookies are sent and received
      });

      const data = await response.json();
      if (data.success) {
        // Check if cookie is set (Optional)
        const token = Cookies.get("token"); // Read the token from cookies

        // Redirect to students page
        navigate("/students");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  // Validate the form data
  const validateForm = () => {
    const errors = {};

    if (!username) {
      errors.username = "Invalid Username, Username is required";
    }

    if (!password) {
      errors.password = "Invalid Username, Password is required";
    }

    return errors;
  };

  return (
    <>
      <Header />
      <div style={{ height: "100vh !important" }} className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <h1 className="text-center my-5">Login</h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Handle input change
                />
                {errors.username && (
                  <div className="text-danger">{errors.username}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group mt-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Handle input change
                />
                {errors.password && (
                  <div className="text-danger">{errors.password}</div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary btn-block mt-4">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
