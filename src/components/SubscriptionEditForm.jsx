import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SubscriptionService from "../services/SubscriptionService";

const SubscriptionEditForm = ({ selectedSubscription, onUpdate, onClose }) => {
  const [productId, setProductId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTransactionDate, setStartTransactionDate] = useState("");
  const [endTransactionDate, setEndTransactionDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (selectedSubscription) {
      setProductId(selectedSubscription.productId || "");
      setStartDate(selectedSubscription.startDate || "");
      setEndDate(selectedSubscription.endDate || "");
      setStartTransactionDate(selectedSubscription.startTransactionDate || "");
      setEndTransactionDate(selectedSubscription.endTransactionDate || "");
      setStatus(selectedSubscription.status || "ACTIVE");
    }
  }, [selectedSubscription]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !startDate || !endDate || !startTransactionDate || !endTransactionDate) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    const updatedSubscription = {
      productId,
      startDate,
      endDate,
      startTransactionDate,
      endTransactionDate,
      status,
    };

    try {
      await SubscriptionService.updateSubscription(selectedSubscription.subscriptionId, updatedSubscription);
      Swal.fire("Success!", "Subscription updated successfully", "success");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  return (
    <div className="container">
      <h2>Edit Subscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product ID</label>
          <input type="number" value={productId} onChange={(e) => setProductId(e.target.value)} disabled />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Start Transaction Date</label>
          <input type="date" value={startTransactionDate} onChange={(e) => setStartTransactionDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>End Transaction Date</label>
          <input type="date" value={endTransactionDate} onChange={(e) => setEndTransactionDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <button type="submit">Update Subscription</button>
        <button type="button" onClick={onClose} className="cancel-btn">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default SubscriptionEditForm;
