import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles.css";

const CustomerTable = ({ customers, onDelete, onEdit }) => {
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

  const handleDelete = (customerId) => {
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
        onDelete(customerId);
        Swal.fire("Deleted!", "The customer has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container table-container">
      <h2>Customer List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((cust) => (
            <tr key={cust.customerId}>
              <td>{cust.customerId}</td>
              <td>{cust.customerName}</td>
              <td>{cust.email}</td>
              <td>{cust.startDate}</td>
              <td style={{ color: cust.status === "ACTIVE" ? "green" : "red" }}>{cust.status}</td>
              <td>
                <button onClick={() => onEdit(cust)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(cust.customerId)}>
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

export default CustomerTable;
