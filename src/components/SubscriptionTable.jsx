import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles.css";

const SubscriptionTable = ({ subscriptions, onDelete, onEdit }) => {
  const [subscriptionList, setSubscriptionList] = useState([]);

  useEffect(() => {
    setSubscriptionList(subscriptions);
  }, [subscriptions]);

  const handleDelete = (subscriptionId) => {
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
        onDelete(subscriptionId);
        Swal.fire("Deleted!", "The subscription has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container table-container">
      <h2>Subscription List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Customer</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Start Transaction Date</th>
            <th>End Transaction Date</th>
            <th>Status</th>
            <th>Attributes</th>
            <th>Dimensions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptionList.map((sub) => (
            <tr key={sub.subscriptionId}>
              <td>{sub.subscriptionId}</td>
              <td>{sub.productId}</td>
              <td>{sub.customerId || "N/A"}</td>
              <td>{sub.startDate || "N/A"}</td>
              <td>{sub.endDate || "N/A"}</td>
              <td>{sub.startTransactionDate || "N/A"}</td>
              <td>{sub.endTransactionDate || "N/A"}</td>
              <td style={{ color: sub.status === "ACTIVE" ? "green" : "red" }}>{sub.status}</td>
              <td>
                {sub.attributes
                  ? Object.entries(sub.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")
                  : "N/A"}
              </td>
              <td>{sub.dimensions ? sub.dimensions.join(", ") : "N/A"}</td>
              <td>
                <button onClick={() => onEdit(sub)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(sub.subscriptionId)}>
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

export default SubscriptionTable;
