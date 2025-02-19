import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../styles.css";

const CustomerEditForm = ({ 
  selectedCustomer, 
  onUpdate, 
  onClose, 
  organizations, 
  divisions 
}) => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  // ✅ Log Initial Selected Customer Data
  useEffect(() => {
    if (selectedCustomer) {
      console.log("🔍 Selected Customer Data:", selectedCustomer);

      setCustomerName(selectedCustomer.customerName || "");
      setEmail(selectedCustomer.email || "");
      setStatus(selectedCustomer.status || "ACTIVE");
      setStartDate(selectedCustomer.startDate?.split("T")[0] || "");

      if (selectedCustomer.organizationId) {
        setSelectedOrganization(selectedCustomer.organizationId);
      } else {
        console.error("❌ Missing Organization ID in Selected Customer");
      }

      if (selectedCustomer.divisionId) {
        setSelectedDivision(selectedCustomer.divisionId);
      } else {
        console.error("❌ Missing Division ID in Selected Customer");
      }
    }
  }, [selectedCustomer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📝 Form Submission Initiated...");
    console.log("📌 Selected Organization:", selectedOrganization);
    console.log("📌 Selected Division:", selectedDivision);
    console.log("📌 Customer Name:", customerName);
    console.log("📌 Email:", email);
    console.log("📌 Status:", status);
    console.log("📌 Start Date (Raw):", startDate);

    if (!customerName || !email || !selectedOrganization || !selectedDivision || !startDate || !status) {
      console.error("❌ Validation Failed: Missing Fields");
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const formattedStartDate = `${startDate}T00:00:00`;

    const customerData = { 
      customerName, 
      email, 
      status, 
      startDate: formattedStartDate 
    };

    console.log("🚀 Sending API Request: ", customerData);

    try {
      await onUpdate(selectedCustomer.customerId, customerData);
      console.log("✅ API Success: Customer Updated");

      Swal.fire("Success!", "Customer updated successfully", "success");
      onClose();
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error);
      Swal.fire("Error", `Failed to update customer: ${error.response?.data?.message || "Unknown error"}`, "error");
    }
  };

  return (
    <div className="container">
      <h2>Edit Customer</h2>
      <form onSubmit={handleSubmit}>

        {/* ✅ Organization Dropdown (Now Pre-filled Correctly) */}
        <div className="form-group">
          <label>Organization</label>
          <select 
            value={selectedOrganization} 
            onChange={(e) => setSelectedOrganization(e.target.value)}
          >
            <option value="">Select an Organization</option>
            {organizations.map((org) => (
              <option key={org.organizationId} value={org.organizationId}>
                {org.organizationName}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Division Dropdown (Now Pre-filled Correctly) */}
        <div className="form-group">
          <label>Division</label>
          <select 
            value={selectedDivision} 
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">Select a Division</option>
            {divisions.map((div) => (
              <option key={div.divisionId} value={div.divisionId}>
                {div.divisionName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* ✅ Status Field Added */}
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        {/* ✅ Start Date Field */}
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default CustomerEditForm;
