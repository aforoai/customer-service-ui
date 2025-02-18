import React, { useState, useEffect } from "react";
import SubscriptionTable from "./SubscriptionTable";
import SubscriptionForm from "./SubscriptionForm";
import SubscriptionService from "../services/SubscriptionService";
import OrganizationService from "../services/OrganizationService";
import DivisionService from "../services/DivisionService";
import CustomerService from "../services/CustomerService";

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

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
      setDivisions([]);
      setCustomers([]);
      setSubscriptions([]);
    }
  }, [selectedOrganization]);

  // ✅ Fetch Customers when Division is selected
  useEffect(() => {
    if (selectedDivision) {
      CustomerService.getAllCustomers(selectedDivision)
        .then(setCustomers)
        .catch((error) => console.error("Error fetching customers:", error));
    } else {
      setCustomers([]);
      setSubscriptions([]);
    }
  }, [selectedDivision]);

  // ✅ Fetch Subscriptions when Customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      fetchSubscriptions(selectedCustomer);
    } else {
      setSubscriptions([]);
    }
  }, [selectedCustomer]);

  // ✅ Function to Fetch Subscriptions
  const fetchSubscriptions = async (customerId) => {
    try {
      const data = await SubscriptionService.getAllSubscriptions(customerId);
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const handleCreate = async (customerId, newSubscription) => {
    try {
      await SubscriptionService.createSubscription(customerId, newSubscription);
      fetchSubscriptions(customerId); // Refresh subscriptions
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  const handleUpdate = async (subscriptionId, updatedSubscription) => {
    try {
      await SubscriptionService.updateSubscription(subscriptionId, updatedSubscription);
      fetchSubscriptions(selectedCustomer); // Refresh subscriptions after update
      setSelectedSubscription(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleDelete = async (subscriptionId) => {
    try {
      await SubscriptionService.deleteSubscription(subscriptionId);
      setSubscriptions(subscriptions.filter((sub) => sub.subscriptionId !== subscriptionId)); // Remove from state
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-5">Manage Subscriptions</h2>

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
        <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
          <option value="">Select a Division</option>
          {divisions.map((div) => (
            <option key={div.divisionId} value={div.divisionId}>
              {div.divisionName}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Customer Dropdown for Filtering Subscriptions */}
      <div className="form-group">
        <label>Filter by Customer</label>
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
          <option value="">Select a Customer</option>
          {customers.map((cust) => (
            <option key={cust.customerId} value={cust.customerId}>
              {cust.customerName}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Subscription Form */}
      <SubscriptionForm
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        selectedSubscription={selectedSubscription}
        setSelectedSubscription={setSelectedSubscription}
      />

      {/* ✅ Subscription Table */}
      <SubscriptionTable
        subscriptions={subscriptions}
        onDelete={handleDelete}
        onEdit={setSelectedSubscription}
      />
    </div>
  );
};

export default SubscriptionManager;
