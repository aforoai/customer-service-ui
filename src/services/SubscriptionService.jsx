import axios from "axios";

const API_BASE_URL = "/v1/api"; // Proxy for Subscription APIs
const PRODUCT_API_BASE_URL = "http://localhost:5001/v1/api/products"; // Proxy for Product API

const SubscriptionService = {
  // ✅ Fetch all subscriptions
  getAllSubscriptions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching subscriptions:", error.response?.data || error.message);
      return [];
    }
  },

  // ✅ Fetch Subscription by ID
  getSubscriptionById: async (subscriptionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error fetching subscription with ID ${subscriptionId}:`,
        error.response?.data || error.message
      );
      return null;
    }
  },

  // ✅ Create a new subscription (Fixed API Endpoint)
  createSubscription: async (customerId, data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/customers/${customerId}/subscriptions`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `❌ Error creating subscription for customer ${customerId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ Update an existing subscription
  updateSubscription: async (subscriptionId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/subscriptions/${subscriptionId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating subscription ${subscriptionId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Delete a subscription
  deleteSubscription: async (subscriptionId) => {
    try {
      await axios.delete(`${API_BASE_URL}/subscriptions/${subscriptionId}`);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting subscription ${subscriptionId}:`, error.response?.data || error.message);
      return false;
    }
  },

  // ✅ Fetch Products filtered by Customer, Organization, and Division
  getAllProducts: async (customerId, organizationId, divisionId) => {
    if (!customerId || !organizationId || !divisionId) {
      console.error("❌ Missing parameters for fetching products!");
      return [];
    }

    try {
      const response = await axios.get(
        `${PRODUCT_API_BASE_URL}?customerId=${customerId}&organizationId=${organizationId}&divisionId=${divisionId}`
      );

      console.log("📦 Fetched Products Response:", response.data);

      if (response.data._embedded && response.data._embedded.productDTOList) {
        return response.data._embedded.productDTOList;
      } else {
        console.warn("⚠️ No products found for given filters.");
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error.response?.data || error.message);
      return [];
    }
  },
};

export default SubscriptionService;
