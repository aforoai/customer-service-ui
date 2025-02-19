import React, { useState, useEffect } from "react";
import DivisionTable from "./DivisionTable";
import DivisionForm from "./DivisionForm";
import DivisionService from "../services/DivisionService";
import OrganizationService from "../services/OrganizationService";

const DivisionManager = () => {
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");

  useEffect(() => {
    OrganizationService.getAllOrganizations().then(setOrganizations);
  }, []);

  const fetchDivisions = async (orgId) => {
    if (!orgId) return;
    try {
      const data = await DivisionService.getAllDivisions(orgId);
      setDivisions(data);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-5">Manage Divisions</h2>
      <select onChange={(e) => {
          setSelectedOrganization(e.target.value);
          fetchDivisions(e.target.value);
        }}
      >
        <option value="">Filter by Organization</option>
        {organizations.map((org) => (
          <option key={org.organizationId} value={org.organizationId}>
            {org.organizationName}
          </option>
        ))}
      </select>
      <DivisionForm
        onCreate={(orgId, data) => DivisionService.createDivision(orgId, data).then(() => fetchDivisions(orgId))}
        onUpdate={(id, data) => DivisionService.updateDivision(id, data).then(() => fetchDivisions(selectedOrganization))}
        selectedDivision={selectedDivision}
        setSelectedDivision={setSelectedDivision}
      />
      <DivisionTable divisions={divisions} onDelete={(id) => DivisionService.deleteDivision(id).then(() => fetchDivisions(selectedOrganization))} onEdit={setSelectedDivision} />
    </div>
  );
};

export default DivisionManager;
