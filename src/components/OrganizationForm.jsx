import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../styles.css"; // Import the CSS file

const OrganizationForm = ({ onCreate, onUpdate, selectedOrg, setSelectedOrg }) => {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (selectedOrg) {
      setOrganizationName(selectedOrg.organizationName);
      setEmail(selectedOrg.email);
      setStatus(selectedOrg.status);
    }
  }, [selectedOrg]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!organizationName || !email) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const orgData = { organizationName, email, status };

    if (selectedOrg) {
      onUpdate(selectedOrg.organizationId, orgData);
      setSelectedOrg(null);
    } else {
      onCreate(orgData);
    }

    Swal.fire({
      title: "Success!",
      text: selectedOrg ? "Organization updated successfully" : "Organization created successfully",
      icon: "success",
      confirmButtonText: "OK",
    });

    setOrganizationName("");
    setEmail("");
    setStatus("ACTIVE");
  };

  return (
    <div className="container">
      <h2>{selectedOrg ? "Edit Organization" : "Create Organization"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Organization Name</label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Enter Organization Name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <button type="submit">{selectedOrg ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default OrganizationForm;
