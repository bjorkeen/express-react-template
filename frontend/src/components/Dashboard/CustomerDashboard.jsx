import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "@/services/ticketService";
import { useAccess } from "@/context/AccessContext"; 
import "./CustomerDashboard.css";
import WelcomeMessage from "./WelcomeMessage";


export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAccess();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyTickets();
        const list = Array.isArray(data) ? data : (data?.tickets || data?.data || []);
        // Sort: Πιο πρόσφατα πρώτα
        list.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
        setTickets(list);
      } catch (err) {
        console.error("Failed to load tickets", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // STATS 
  const stats = useMemo(() => {
    const total = tickets.length;
    const active = tickets.filter(t => {
      const s = (t.status || t.state || "").toLowerCase();
      return !s.includes('complete') && !s.includes('cancel') && !s.includes('closed');
    }).length;
    const completed = tickets.filter(t => {
      const s = (t.status || t.state || "").toLowerCase();
      return s.includes('complete') || s.includes('closed');
    }).length;
    
    return { total, active, completed };
  }, [tickets]);

  // Βοηθητική για χρώματα status (ίδια με Technician)
  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("submit") || s.includes("new")) return "badge-submitted";
    if (s.includes("valid") || s.includes("pending")) return "badge-pending";
    if (s.includes("progress")) return "badge-progress";
    if (s.includes("wait") || s.includes("parts")) return "badge-warning";
    if (s.includes("complete") || s.includes("closed")) return "badge-completed";
    return "badge-default";
  };

  return (
    <div className="dash-container">
      <WelcomeMessage/>

      {/* HEADER */}
      <div className="dash-header">
        <div>
            <h1 className="dash-title">Overview</h1>
        </div>
        <button className="new-ticket-btn" onClick={() => navigate('/create-ticket')}>
            + New Request
        </button>
      </div>

      {/* STATS CARDS (GRID) */}
      <div className="dash-stats-grid">
        {/* Total */}
        <div className="dash-stat-card">
            <div className="stat-label">Total Requests</div>
            <div className="stat-value">{stats.total}</div>
        </div>
        
        {/* Active */}
        <div className="dash-stat-card">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: "#b45309" }}>{stats.active}</div>
        </div>

        {/* Completed */}
        <div className="dash-stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: "#15803d" }}>{stats.completed}</div>
        </div>
      </div>

      {/* 3. TABLE SECTION (BELOW CARDS) */}
      <div className="dash-table-container">
        <div className="dash-section-header">
            <h3>Recent Tickets</h3>
            {tickets.length > 5 && (
                <button className="view-all-link" onClick={() => navigate('/requests')}>
                    View All History
                </button>
            )}
        </div>

        {loading ? (
           <div style={{padding:'20px', textAlign:'center', color:'#6b7280'}}>Loading...</div>
        ) : tickets.length === 0 ? (
           <div style={{padding:'20px', textAlign:'center', color:'#6b7280'}}>No tickets found.</div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Product</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 8).map((t) => ( // Δείχνουμε τα 8 τελευταία εδώ
                <tr key={t._id || t.ticketId}>
                  <td className="font-mono">
                    {t.ticketId || t.ticketNumber || (t._id ? t._id.substring(0,8) : "-")}
                  </td>
                  <td style={{fontWeight:600}}>
                    {t.product?.model || t.model || "Unknown Product"}
                  </td>
                  <td style={{maxWidth:'200px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'#6b7280'}}>
                     {t.issueDescription || "No description"}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(t.status || t.state)}>
                      {t.status || t.state || "Unknown"}
                    </span>
                  </td>
                  <td style={{color:'#6b7280', fontSize:'0.9rem'}}>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button 
                        className="action-btn"
                        onClick={() => navigate(`/tickets/${t._id || t.ticketId}`)}
                    >
                        View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}