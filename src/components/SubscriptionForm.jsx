import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import OrganizationService from "../services/OrganizationService";
import DivisionService from "../services/DivisionService";
import CustomerService from "../services/CustomerService";
import SubscriptionService from "../services/SubscriptionService";
import "../styles.css";

const SubscriptionForm = ({ onCreate, selectedSubscription, onUpdate, setSelectedSubscription }) => {
  const [organizations, setOrganizations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Required fields
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTransactionDate, setStartTransactionDate] = useState("");
  const [endTransactionDate, setEndTransactionDate] = useState("");
  const [status, setStatus] = useState("ACTIVE"); // Ensured status is used

  const [attributes, setAttributes] = useState([{ key: "", value: "" }]); // Ensured attributes are used
  const [dimensions, setDimensions] = useState([""]); // Ensured dimensions are used

  useEffect(() => {
    OrganizationService.getAllOrganizations()
      .then(setOrganizations)
      .catch((error) => console.error("❌ Error fetching organizations:", error));
  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      DivisionService.getAllDivisions(selectedOrganization)
        .then(setDivisions)
        .catch((error) => console.error("❌ Error fetching divisions:", error));
    } else {
      setDivisions([]);
      setCustomers([]);
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (selectedDivision) {
      CustomerService.getAllCustomers(selectedDivision)
        .then(setCustomers)
        .catch((error) => console.error("❌ Error fetching customers:", error));
    } else {
      setCustomers([]);
    }
  }, [selectedDivision]);

  useEffect(() => {
    if (selectedCustomer && selectedOrganization && selectedDivision) {
      SubscriptionService.getAllProducts(selectedCustomer, selectedOrganization, selectedDivision)
        .then(setProducts)
        .catch((error) => console.error("❌ Error fetching products:", error));
    } else {
      setProducts([]);
    }
  }, [selectedCustomer, selectedOrganization, selectedDivision]);

  const formatDate = (date) => {
    return date ? `${date}T00:00:00` : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrganization || !selectedDivision || !selectedCustomer || !selectedProduct || !startTransactionDate || !endTransactionDate) {
      Swal.fire("Error", "All fields must be filled before submitting!", "error");
      return;
    }

    const subscriptionData = {
      productId: selectedProduct,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startTransactionDate: formatDate(startTransactionDate),
      endTransactionDate: formatDate(endTransactionDate),
      status,
      customerId: selectedCustomer,
      attributes: Object.fromEntries(attributes.map((attr) => [attr.key, attr.value])),
      dimensions: dimensions.filter((dim) => dim.trim() !== ""),
    };

    console.log("📦 Subscription Payload (Check before sending to backend):", subscriptionData);

    try {
      if (selectedSubscription) {
        await onUpdate(selectedSubscription.subscriptionId, subscriptionData);
        Swal.fire("Success!", "Subscription updated successfully", "success");
        setSelectedSubscription(null);
      } else {
        await onCreate(selectedCustomer, subscriptionData);
        Swal.fire("Success!", "Subscription created successfully", "success");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      Swal.fire("Error", `Failed to create/update subscription: ${error.message}`, "error");
    }
  };

  return (
    <div className="container">
      <h2>{selectedSubscription ? "Edit Subscription" : "Create Subscription"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Organization</label>
          <select value={selectedOrganization} onChange={(e) => setSelectedOrganization(e.target.value)}>
            <option value="">Select an Organization</option>
            {organizations.map((org) => (
              <option key={org.organizationId} value={org.organizationId}>
                {org.organizationName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Division</label>
          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">Select a Division</option>
            {divisions.map((div) => (
              <option key={div.divisionId} value={div.divisionId}>
                {div.divisionName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Customer</label>
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
            <option value="">Select a Customer</option>
            {customers.map((cust) => (
              <option key={cust.customerId} value={cust.customerId}>
                {cust.customerName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Select a Product</option>
            {products.map((prod) => (
              <option key={prod.productId} value={prod.productId}>
                {prod.productName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Start Transaction Date</label>
          <input type="date" value={startTransactionDate} onChange={(e) => setStartTransactionDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>End Transaction Date</label>
          <input type="date" value={endTransactionDate} onChange={(e) => setEndTransactionDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="form-group">
          <label>Attributes (Key-Value Pairs)</label>
          <input type="text" placeholder="Key:Value" onChange={(e) => setAttributes([{ key: "default", value: e.target.value }])} />
        </div>

        <div className="form-group">
          <label>Dimensions</label>
          <input type="text" placeholder="Dimension" onChange={(e) => setDimensions([e.target.value])} />
        </div>

        <button type="submit">{selectedSubscription ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
