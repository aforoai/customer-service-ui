import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles.css"; // Import the CSS file

const OrganizationTable = ({ organizations, onDelete, onEdit }) => {
  const [organizationList, setOrganizationList] = useState([]);

  useEffect(() => {
    setOrganizationList(organizations); // Ensure the state updates when props change
  }, [organizations]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire("Deleted!", "The organization has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container table-container">
      <h2>Organization List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizationList.map((org) => (
            <tr key={org.organizationId}>
              <td>{org.organizationId}</td>
              <td>{org.organizationName}</td>
              <td>{org.email}</td>
              <td style={{ color: org.status === "ACTIVE" ? "green" : "red" }}>
                {org.status}
              </td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(org)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(org.organizationId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationTable;
