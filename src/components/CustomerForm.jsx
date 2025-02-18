import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import OrganizationService from "../services/OrganizationService";
import DivisionService from "../services/DivisionService";
import "../styles.css";

const CustomerForm = ({ onCreate, onUpdate, selectedCustomer, setSelectedCustomer }) => {
  const [organizations, setOrganizations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");

  // ✅ Fetch Organizations for dropdown
  useEffect(() => {
    OrganizationService.getAllOrganizations()
      .then(setOrganizations)
      .catch((error) => console.error("Error fetching organizations:", error));
  }, []);

  // ✅ Fetch Divisions when Organization is selected
  useEffect(() => {
    if (selectedOrganization) {
      DivisionService.getAllDivisions(selectedOrganization)
        .then(setDivisions)
        .catch((error) => console.error("Error fetching divisions:", error));
    } else {
      setDivisions([]);
    }
  }, [selectedOrganization]);

  // ✅ Prefill form when Editing
  useEffect(() => {
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.customerName || "");
      setEmail(selectedCustomer.email || "");
      setStatus(selectedCustomer.status || "ACTIVE");
      setStartDate(selectedCustomer.startDate || "");

      // ✅ Set Organization Dropdown (Load and Select the Right One)
      setSelectedOrganization(selectedCustomer.organizationId || "");

      // ✅ Fetch Divisions based on the Organization and Select the Correct Division
      if (selectedCustomer.organizationId) {
        DivisionService.getAllDivisions(selectedCustomer.organizationId)
          .then((divisionList) => {
            setDivisions(divisionList);
            setSelectedDivision(selectedCustomer.divisionId || "");
          })
          .catch((error) => console.error("Error fetching divisions:", error));
      }
    }
  }, [selectedCustomer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !email || !selectedOrganization || !selectedDivision) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const formattedStartDate = startDate ? `${startDate}T00:00:00` : null;

    const customerData = { customerName, email, status, startDate: formattedStartDate };

    try {
      if (selectedCustomer) {
        await onUpdate(selectedCustomer.customerId, customerData);
        Swal.fire("Success!", "Customer updated successfully", "success");
        setSelectedCustomer(null);
      } else {
        await onCreate(selectedDivision, customerData);
        Swal.fire("Success!", "Customer created successfully", "success");
      }

      // ✅ Reset Form Fields
      setCustomerName("");
      setEmail("");
      setStatus("ACTIVE");
      setStartDate("");
      setSelectedOrganization("");
      setSelectedDivision("");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      Swal.fire("Error", `Failed to create/update customer: ${error.response?.data?.message || "Unknown error"}`, "error");
    }
  };

  return (
    <div className="container">
      <h2>{selectedCustomer ? "Edit Customer" : "Create Customer"}</h2>
      <form onSubmit={handleSubmit}>

        {/* ✅ Organization Dropdown (Prefilled & Disabled in Edit Mode) */}
        <div className="form-group">
          <label>Organization</label>
          <select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            disabled={!!selectedCustomer} // ✅ Disable when Editing
          >
            <option value="">Select an Organization</option>
            {organizations.map((org) => (
              <option key={org.organizationId} value={org.organizationId}>
                {org.organizationName}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Division Dropdown (Prefilled & Disabled in Edit Mode) */}
        <div className="form-group">
          <label>Division</label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            disabled={!!selectedCustomer} // ✅ Disable when Editing
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
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter Customer Name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <button type="submit">{selectedCustomer ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CustomerForm;
