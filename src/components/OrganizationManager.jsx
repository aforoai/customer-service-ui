import React, { useState, useEffect } from "react";
import OrganizationTable from "./OrganizationTable";
import OrganizationForm from "./OrganizationForm";
import OrganizationService from "../services/OrganizationService";

const OrganizationManager = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await OrganizationService.getAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleCreate = async (newOrg) => {
    try {
      await OrganizationService.createOrganization(newOrg);
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const handleUpdate = async (id, updatedOrg) => {
    try {
      await OrganizationService.updateOrganization(id, updatedOrg);
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await OrganizationService.deleteOrganization(id);
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  return (
    <div>
      <OrganizationForm onCreate={handleCreate} onUpdate={handleUpdate} selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} />
      <OrganizationTable organizations={organizations} onDelete={handleDelete} onEdit={setSelectedOrg} />
    </div>
  );
};

export default OrganizationManager;
