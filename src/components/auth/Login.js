import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      login(token, user);

      if (user.role === "Admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/employee/dashboard";
      }
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  // ... JSX for form
};
