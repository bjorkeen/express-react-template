import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import { getMyTickets } from "@/services/ticketService";

// Helper Functions
function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function normalizeStatus(raw) {
  if (!raw) return "Unknown";
  const s = String(raw).toLowerCase();
  if (s.includes("new") || s.includes("submitted")) return "Submitted";
  if (s.includes("progress")) return "In Progress";
  if (s.includes("complete") || s.includes("resolved")) return "Completed";
  if (s.includes("cancel") || s.includes("reject")) return "Cancelled";
  if (s.includes("validation")) return "Pending Validation";
  if (s.includes("parts")) return "Waiting for Parts";
  return String(raw).charAt(0).toUpperCase() + String(raw).slice(1);
}

function statusClass(statusLabel) {
  const s = statusLabel.toLowerCase().replace(/ /g, '-');
  return `td-status-badge badge-${s}`;
}

// Helpers για ασφαλή ανάγνωση δεδομένων
function getTicketId(t) { return t.ticketId || t.ticketNumber || t._id || "-"; }
function getModel(t) { return t.model || t.product?.model || "-"; }
function getSerial(t) { return t.serialNumber || t.product?.serialNumber || "-"; }
function getIssue(t) { return t.category || t.issue?.category || "-"; }
function getLastUpdate(t) { return t.updatedAt || t.lastUpdatedAt || t.createdAt || null; }
function getServiceType(t) { // Για να βλέπουμε αν είναι Repair ή Return
  // Ελέγχουμε και το serviceType (από τη βάση) και το type (για συμβατότητα)
  return t.serviceType || t.type || "Repair"; 
}

export default function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  // Scroll Lock όταν ανοίγει το Modal
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  // Fetch Tickets
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMyTickets();
        const list = Array.isArray(data) ? data : (data?.tickets || data?.data || []);
        if (alive) setTickets(list);
      } catch (err) {
        if (alive) setErrorMsg("Failed to load tickets.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  // Reset page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, dateFrom, dateTo]);

  const availableStatuses = useMemo(() => {
    const set = new Set(tickets.map((t) => normalizeStatus(t.status || t.state)));
    return ["All", ...Array.from(set)];
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    if (to) to.setHours(23, 59, 59, 999);

    return tickets.filter((t) => {
      const statusLabel = normalizeStatus(t.status || t.state);
      const ticketType = getServiceType(t);
      if (q && !`${getTicketId(t)} ${getSerial(t)} ${getModel(t)}`.toLowerCase().includes(q)) return false;
      if (statusFilter !== "All" && statusLabel !== statusFilter) return false;
      if (typeFilter !== "All" && ticketType !== typeFilter) return false;
      if (from || to) {
        const d = getLastUpdate(t) ? new Date(getLastUpdate(t)) : null;
        if (!d || (from && d < from) || (to && d > to)) return false;
      }
      return true;
    });
  }, [tickets, query, statusFilter, typeFilter, dateFrom, dateTo]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const onViewDetails = (t) => { setSelectedTicket(t); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedTicket(null); };

  return (
    <div className="mt-page">
      <div className="mt-container">
        
        <div style={{ marginBottom: "20px" }}>
          <h1 className="mt-title">My Requests</h1>
          <p className="mt-subtitle">Manage and track your repair and return requests</p>
        </div>

        {/* Filters */}
        <div className="mt-filters">
          <div className="mt-filter">
            <label className="mt-label">Search</label>
            <div className="mt-inputwrap">
              <span className="mt-icon">🔍</span>
              <input className="mt-input" placeholder="Ticket ID or Serial Number" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="mt-filter">
            <label className="mt-label">Request Type</label>
            <select className="mt-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Repair">Repair</option>
              <option value="Return">Return</option>
            </select>
          </div>
          <div className="mt-filter">
            <label className="mt-label">Status</label>
            <select className="mt-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {availableStatuses.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
            </select>
          </div>
          <div className="mt-filter">
            <label className="mt-label">Date Range</label>
            <div className="mt-daterow">
              <input className="mt-input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <input className="mt-input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-tablecard">
          {loading ? <div className="mt-state">Loading tickets…</div> : 
           errorMsg ? <div className="mt-state mt-error">{errorMsg}</div> :
           filteredTickets.length === 0 ? <div className="mt-state">No tickets found.</div> : (
            <>
              <table className="mt-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Type</th>
                    <th>Product</th>
                    <th>Issue</th>
                    <th>Status</th>
                    <th>Last Update</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.map((t) => {
                    const type = getServiceType(t); // Χρήση του serviceType
                    const isReturn = type.toLowerCase() === 'return';

                    return (
                    <tr key={getTicketId(t)}>
                      <td className="mt-mono">{getTicketId(t)}</td>
                      
                      {/* TYPE BADGE */}
                      <td>
                        <span className={`type-badge ${isReturn ? 'type-return' : 'type-repair'}`}>
                          {type}
                        </span>
                      </td>

                      <td>
                        <div className="mt-product">
                          <div className="mt-product-model">{getModel(t)}</div>
                          <div className="mt-product-serial">{getSerial(t)}</div>
                        </div>
                      </td>
                      <td>{getIssue(t)}</td>
                      <td>
                        <span className={statusClass(normalizeStatus(t.status || t.state))}>
                          {normalizeStatus(t.status || t.state)}
                        </span>
                      </td>
                      <td className="mt-datetime">{formatDateTime(getLastUpdate(t))}</td>
                      <td className="mt-actions-col">
                        <button className="mt-link" onClick={() => onViewDetails(t)}>View Details</button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="mt-pagination">
                  <div className="pg-info">
                    Showing {indexOfFirstTicket + 1} to {Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length}
                  </div>
                  <div className="pg-controls">
                    {/* Το Previous αριστερά */}
                    <button
                      className="pg-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </button>

                    {/* Η σειρά αριθμών 1, 2, 3 */}
                    <div className="pg-numbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          className={`pg-num ${currentPage === i + 1 ? 'active' : ''}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    {/* Το Next δεξιά */}
                    <button
                      className="pg-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedTicket && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="td-header">
                <div className="td-title">
                  {/* Δυναμικός Τίτλος Modal */}
                  <h1>
                    {getServiceType(selectedTicket) === 'Return' ? 'Return Request' : 'Repair Request'}
                  </h1>
                  <div className="td-id">ID: {getTicketId(selectedTicket)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={statusClass(normalizeStatus(selectedTicket.status))}>
                    {normalizeStatus(selectedTicket.status)}
                  </div>
                  <button className="modal-close" onClick={closeModal}>×</button>
                </div>
              </div>

              <div className="modal-content">
                {normalizeStatus(selectedTicket.status) !== 'Cancelled' && (
                  <div className="td-timeline">
                     <div className="td-progress-bar">
                       <div className="td-progress-fill" style={{ width: '25%' }}></div>
                     </div>
                     {['Submitted', 'In Progress', 'Completed', 'Closed'].map((step, idx) => (
                        <div key={step} className={`td-step ${idx === 0 ? 'active' : ''}`}>
                          <div className="td-step-circle">{idx + 1}</div>
                          <div className="td-step-label">{step}</div>
                        </div>
                     ))}
                  </div>
                )}
                
                <div className="td-grid">
                  {/* Main Content */}
                  <div className="td-main">
                    <div className="td-section">
                      <div className="td-section-title">Description</div>
                      <div className="td-text">
                        {selectedTicket.issue?.description || selectedTicket.description || 'N/A'}
                      </div>
                    </div>
                    <div className="td-section">
                       <div className="td-section-title">Product Details</div>
                       <div className="td-text">
                          <strong>Model:</strong> {getModel(selectedTicket)} <br/>
                          <strong>Serial:</strong> {getSerial(selectedTicket)}
                       </div>
                    </div>
                    <div className="td-section">
                       <div className="td-section-title">Customer Details</div>
                       <div className="td-text">
                          <strong>Name:</strong> {selectedTicket.contactInfo?.fullName || 'N/A'} <br/>
                          <strong>Email:</strong> {selectedTicket.contactInfo?.email || 'N/A'}
                       </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="td-sidebar">
                    <div className="td-section">
                    </div>
                    <div className="td-section">
                      <div className="td-section-title">Date Submitted</div>
                      <div className="td-text">{formatDateTime(selectedTicket.createdAt)}</div>
                    </div>
                    <div className="td-section">
                      <div className="td-section-title">Purchase Date</div>
                      <div className="td-text">
                        {selectedTicket.product?.purchaseDate 
                          ? new Date(selectedTicket.product.purchaseDate).toLocaleDateString() 
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}