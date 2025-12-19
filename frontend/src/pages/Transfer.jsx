import { useState } from "react";
import api from "../api/api";
import "../App.css";

export default function Transfer({ onTransfer }) {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/transfer/", {
        receiver_id: Number(receiverId),
        amount: Number(amount),
      });

      setMessage("Transfer successful");
      setReceiverId("");
      setAmount("");
      onTransfer();
    } catch (err) {
      setError(err.response?.data?.detail || "Transfer failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="card">
        <button
          className="button"
          style={{ background: "#dc2626", marginBottom: "16px" }}
          onClick={handleLogout}
        >
          Logout
        </button>

        <h2>Transfer Funds</h2>

        <form onSubmit={handleTransfer}>
          <input
            className="input"
            placeholder="Receiver User ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button className="button" type="submit">
            Send Money
          </button>
        </form>

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
