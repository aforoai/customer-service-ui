import React, { useState, useEffect } from "react";
import CustomerTable from "./CustomerTable";
import CustomerForm from "./CustomerForm";
import CustomerEditForm from "./CustomerEditForm";
import CustomerService from "../services/CustomerService";
import OrganizationService from "../services/OrganizationService";
import DivisionService from "../services/DivisionService";

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  // ✅ Fetch Organizations on Load
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
      setDivisions([]); // Clear divisions if no organization is selected
    }
  }, [selectedOrganization]);

  // ✅ Fetch Customers when Division is selected
  useEffect(() => {
    if (selectedDivision) {
      fetchCustomers(selectedDivision);
    } else {
      setCustomers([]);
    }
  }, [selectedDivision]);

  // ✅ Function to Fetch Customers
  const fetchCustomers = async (divisionId) => {
    try {
      const data = await CustomerService.getAllCustomers(divisionId);
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleCreate = async (divisionId, newCustomer) => {
    try {
      await CustomerService.createCustomer(divisionId, newCustomer);
      fetchCustomers(divisionId);
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleUpdate = async (customerId, updatedCustomer) => {
    try {
      await CustomerService.updateCustomer(customerId, updatedCustomer);
      fetchCustomers(selectedDivision);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await CustomerService.deleteCustomer(customerId);
      setCustomers(customers.filter((cust) => cust.customerId !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-5">Manage Customers</h2>

      {/* ✅ Organization Dropdown for Filtering Divisions */}
      <div className="form-group">
        <label>Filter by Organization</label>
        <select value={selectedOrganization} onChange={(e) => setSelectedOrganization(e.target.value)}>
          <option value="">Select an Organization</option>
          {organizations.map((org) => (
            <option key={org.organizationId} value={org.organizationId}>
              {org.organizationName}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Division Dropdown for Filtering Customers */}
      <div className="form-group">
        <label>Filter by Division</label>
        <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} disabled={!selectedOrganization}>
          <option value="">Select a Division</option>
          {divisions.map((div) => (
            <option key={div.divisionId} value={div.divisionId}>
              {div.divisionName}
            </option>
          ))}
        </select>
      </div>

      {!showEditForm && <CustomerForm onCreate={handleCreate} />}
      
      {showEditForm && selectedCustomer && (
        <CustomerEditForm
          selectedCustomer={selectedCustomer}
          onUpdate={handleUpdate}
          onClose={() => setShowEditForm(false)}
          organizations={organizations}
          divisions={divisions}
          selectedOrganization={selectedOrganization}
          selectedDivision={selectedDivision}
        />
      )}

      <CustomerTable
        customers={customers}
        onDelete={handleDelete}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          setShowEditForm(true);
        }}
      />
    </div>
  );
};

export default CustomerManager;
