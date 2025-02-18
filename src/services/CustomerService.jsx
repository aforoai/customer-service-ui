import axios from "axios";

const API_BASE_URL = "/v1/api";

const CustomerService = {
  getAllCustomers: (divisionId) =>
    axios
      .get(`${API_BASE_URL}/divisions/${divisionId}/customers`)
      .then((response) => response.data._embedded?.customerDTOList || []),

  createCustomer: async (divisionId, data) => {
    if (!divisionId) {
      throw new Error("Division ID is required to create a customer.");
    }
    console.log(`POST /divisions/${divisionId}/customers`, data);
    return axios
      .post(`${API_BASE_URL}/divisions/${divisionId}/customers`, data)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error in API response:", error.response?.data || error);
        throw error;
      });
  },

  updateCustomer: (customerId, data) =>
    axios.put(`${API_BASE_URL}/customers/${customerId}`, data).then((response) => response.data),

  deleteCustomer: (customerId) =>
    axios.delete(`${API_BASE_URL}/customers/${customerId}`).then((response) => response.data),
};

export default CustomerService;
