import axios from "axios";

const API_URL = "YOUR_MONGODB_API_URL"; // Replace this with your MongoDB Atlas API URL.

const AuthService = {
  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default AuthService;
