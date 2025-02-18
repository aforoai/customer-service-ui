import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import OrganizationService from "../services/OrganizationService";
import "../styles.css";

const DivisionForm = ({ onCreate, onUpdate, selectedDivision, setSelectedDivision }) => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [divisionName, setDivisionName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    OrganizationService.getAllOrganizations()
      .then((data) => setOrganizations(data))
      .catch((error) => console.error("Error fetching organizations:", error));
  }, []);

  useEffect(() => {
    if (selectedDivision) {
      setDivisionName(selectedDivision.divisionName || "");
      setEmail(selectedDivision.email || "");
      setStatus(selectedDivision.status || "ACTIVE");
    }
  }, [selectedDivision]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!divisionName || !email || (!selectedOrganization && !selectedDivision)) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const divisionData = { divisionName, email, status };

    try {
      if (selectedDivision) {
        await onUpdate(selectedDivision.divisionId, divisionData);
        Swal.fire("Success!", "Division updated successfully", "success");
        setSelectedDivision(null);
      } else {
        await onCreate(selectedOrganization, divisionData);
        Swal.fire("Success!", "Division created successfully", "success");
      }

      setDivisionName("");
      setEmail("");
      setStatus("ACTIVE");
      setSelectedOrganization("");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to create/update division", "error");
    }
  };

  return (
    <div className="container">
      <h2>{selectedDivision ? "Edit Division" : "Create Division"}</h2>
      <form onSubmit={handleSubmit}>
        {!selectedDivision && (
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
        )}

        <div className="form-group">
          <label>Division Name</label>
          <input
            type="text"
            value={divisionName}
            onChange={(e) => setDivisionName(e.target.value)}
            placeholder="Enter Division Name"
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

        <button type="submit">{selectedDivision ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default DivisionForm;
