import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicket,
  updateTicketStatus,
  addInternalComment,
} from "@/services/ticketService";
import { useAccess } from "@/context/AccessContext";
import "./TicketDetails.css";

const STEPS = ["Submitted", "In Progress", "Completed", "Closed"];

const ALL_STATUSES = [
  "Submitted",
  "Pending Validation",
  "In Progress",
  "Waiting for Parts",
  "Shipping",
  "Shipped Back",
  "Ready for Pickup",
  "Completed",
  "Closed",
  "Cancelled",
];

const STATUS_TRANSITIONS = {
  Submitted: ["Pending Validation", "Cancelled"],
  "Pending Validation": ["In Progress", "Cancelled"],
  "In Progress": [
    "Waiting for Parts",
    "Shipping",
    "Ready for Pickup",
    "Completed",
    "Cancelled",
  ],
  "Waiting for Parts": ["In Progress", "Cancelled"],
  Shipping: ["Pending Validation", "In Progress", "Cancelled"],
  "Shipped Back": ["Completed"],
  "Ready for Pickup": ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

export default function TicketDetailsPage() {
  // hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAccess();
  // state
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [savingComment, setSavingComment] = useState(false);
  const [commentType, setCommentType] = useState("Note");

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSavingComment(true);
      const updated = await addInternalComment(id, commentText, commentType);
      setTicket(updated);
      setCommentText("");
    } catch (err) {
      alert("Failed to add internal comment.");
    } finally {
      setSavingComment(false);
    }
  };
  // helper to get comment type class
  const getCommentTypeClass = (type) => {
    switch (type) {
      case "Waiting for Parts":
        return "td-chip-waiting";
      case "Escalation":
        return "td-chip-escalation";
      case "SLA Risk":
        return "td-chip-sla";
      default:
        return "td-chip-note";
    }
  };

  // Fetch Ticket
  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicket(id);
      setTicket(data);
    } catch (err) {
      setError("Ticket not found or unauthorized.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // Status change Handler (Technician)
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      // Optimistic Update
      setTicket((prev) => ({ ...prev, status: newStatus }));
      await updateTicketStatus(id, newStatus);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status";
      alert(msg);
      fetchTicket();
    }
  };

  if (loading) return <div className="td-container">Loading...</div>;
  if (error)
    return (
      <div className="td-container" style={{ color: "red" }}>
        {error}
      </div>
    );
  if (!ticket) return null;

  // --- Restricted status transitions  ---
  const currentStatus = ticket.status || "Submitted";
  const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  // Repair ή Return
  const requestType = ticket.serviceType || "Repair";

  return (
    <div className="td-page">
      <div className="td-container">
        <button onClick={() => navigate(-1)} className="td-back-btn">
          ← Back to Dashboard
        </button>

        <div className="td-card">
          {/* Header */}
          <div className="td-header">
            <div className="td-title">
              <h1>{requestType} Request</h1>
              <div className="td-id">ID: {ticket.ticketId || ticket._id}</div>
            </div>

            <div
              className={`td-status-badge badge-${(ticket.status || "submitted")
                .toLowerCase()
                .replace(/ /g, "-")}`}
            >
              {ticket.status}
            </div>
          </div>

          <div className="td-content">
            <div className="td-grid">
              <div className="td-main">
                <div className="td-section">
                  <div className="td-section-title">Description</div>
                  {user?.role !== "Customer" && (
                    <div className="td-section">
                      <div className="td-section-title">Internal Comments</div>

                      <div className="td-comments-list">
                        {ticket?.internalComments?.length ? (
                          ticket.internalComments.map((c, idx) => (
                            <div key={idx} className="td-comment">
                              <div className="td-comment-meta">
                                <div className="td-comment-meta-left">
                                  <strong>
                                    {c?.by?.fullName ||
                                      c?.by?.email?.split("@")[0] ||
                                      "User"}
                                  </strong>

                                  <span
                                    className={`td-comment-chip ${getCommentTypeClass(
                                      c?.type
                                    )}`}
                                  >
                                    {c?.type || "Note"}
                                  </span>
                                </div>

                                <span>
                                  {new Date(c.createdAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="td-comment-text">{c.text}</div>
                            </div>
                          ))
                        ) : (
                          <div className="td-text">
                            No internal comments yet.
                          </div>
                        )}
                      </div>

                      <div className="td-comment-box">
                        {/* Comment type selector */}
                        <select
                          value={commentType}
                          onChange={(e) => setCommentType(e.target.value)}
                          disabled={savingComment}
                          className="td-comment-type"
                        >
                          <option value="Note">Note</option>
                          <option value="Waiting for Parts">
                            Waiting for Parts
                          </option>
                          <option value="Escalation">Escalation</option>
                          <option value="SLA Risk">SLA Risk</option>
                        </select>

                        {/* Comment text */}
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write an internal note (not visible to customers)…"
                          disabled={savingComment}
                        />

                        {/* Submit button */}
                        <button
                          type="button"
                          onClick={handleAddComment}
                          disabled={savingComment || !commentText.trim()}
                          className="td-comment-btn"
                        >
                          {savingComment ? "Saving..." : "Add Comment"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="td-text">
                    {ticket.issue?.description ||
                      ticket.description ||
                      "No description provided."}
                  </div>
                </div>

                <div className="td-section">
                  <div className="td-section-title">Product Info</div>
                  <div className="td-text">
                    <strong>Model:</strong> {ticket.product?.model} <br />
                    <strong>Serial:</strong> {ticket.product?.serialNumber}{" "}
                    <br />
                    <strong>Type:</strong> {ticket.product?.type}
                  </div>
                </div>
              </div>

              <div className="td-sidebar">
                <div className="td-section">
                  <div className="td-section-title">Request Details</div>
                  <div className="td-text">
                    <strong>Type:</strong> {requestType} <br />
                    <strong>Date:</strong>{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Τεχνικά controls (αν ο χρήστης είναι Admin/Technician) */}
                {(user.role === "Technician" || user.role === "Admin") && (
                  <div className="td-section">
                    <div
                      className="td-section-title"
                      style={{ color: "#0369a1" }}
                    >
                      Action
                    </div>
                    <select
                      value={ticket.status}
                      onChange={handleStatusChange}
                      style={{ padding: "8px", width: "100%" }}
                    >
                      {/* Always show current status */}
                      <option value={currentStatus}>{currentStatus}</option>

                      {user?.role === "Technician"
                        ? // ✅ Technician: only allowed next statuses
                          allowedNextStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))
                        : // ✅ Admin/Manager/Employee: all statuses
                          ALL_STATUSES.filter((s) => s !== currentStatus).map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            )
                          )}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
