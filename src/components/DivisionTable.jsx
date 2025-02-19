import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles.css";

const DivisionTable = ({ divisions, onDelete, onEdit }) => {
  const [divisionList, setDivisionList] = useState([]);

  useEffect(() => {
    setDivisionList(divisions);
  }, [divisions]);

  const handleDelete = (divisionId) => {
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
        onDelete(divisionId);
        Swal.fire("Deleted!", "The division has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container table-container">
      <h2>Division List</h2>
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
          {divisionList.map((div) => (
            <tr key={div.divisionId}>
              <td>{div.divisionId}</td>
              <td>{div.divisionName}</td>
              <td>{div.email}</td>
              <td style={{ color: div.status === "ACTIVE" ? "green" : "red" }}>{div.status}</td>
              <td>
                <button onClick={() => onEdit(div)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(div.divisionId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DivisionTable;
