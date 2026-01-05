import { useEffect, useState, useMemo } from "react";
import { getAllTicketsAdmin } from "@/services/ticketService";
// ΠΡΟΣΘΗΚΗ: updateUser στο import
import { getAllUsers, deleteUser, createUser, updateUser } from "@/services/authService"; 
import styles from "./AdminDashboard.module.css";
import { useNotification } from "@/context/NotificationContext";

const AdminDashboard = () => {
  const { showNotification } = useNotification();
  
  // --- Data States ---
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  // --- Filter States (Για το Tab 'All Tickets') ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- Modal States (Create / Edit) ---
  const [showModal, setShowModal] = useState(false); // Ενιαίο Modal
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", role: "Technician", specialty: "Smartphone",
  });

  // --- Delete Modal State ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketsData, usersData] = await Promise.all([
          getAllTicketsAdmin(),
          getAllUsers(),
        ]);
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  // --- STATISTICS & FILTERS (Διατηρήθηκαν από τον κώδικά σου) ---
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.contactInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const completed = tickets.filter((t) => t.status === "Completed").length;
    const pending = tickets.filter((t) => ["Pending", "Submitted", "In Progress"].includes(t.status)).length;
    const underWarranty = tickets.filter((t) => t.warrantyStatus === "Under Warranty").length;

    return {
      total,
      completed,
      completedRate: total > 0 ? (completed / total) * 100 : 0,
      pending,
      underWarranty,
      warrantyRate: total > 0 ? (underWarranty / total) * 100 : 0,
    };
  }, [tickets]);


  // --- USER HANDLERS (New Logic) ---

  // 1. DELETE FLOW
  const initiateDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
        await deleteUser(userToDelete._id || userToDelete.id);
        setUsers(users.filter(u => (u._id || u.id) !== (userToDelete._id || userToDelete.id)));
        showNotification("User deleted successfully", "success");
    } catch (err) {
        showNotification(err.response?.data?.message || "Failed to delete user", "error");
    } finally {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    }
  };

  // 2. CREATE / EDIT FLOW
  const openCreateModal = () => {
    setIsEditing(false);
    setEditUserId(null);
    setFormData({ fullName: '', email: '', password: '', role: 'Technician', specialty: 'Smartphone' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setEditUserId(user._id || user.id);
    setFormData({
        fullName: user.fullName,
        email: user.email,
        password: '', // Κενό για ασφάλεια
        role: user.role,
        specialty: user.specialty || 'Smartphone'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        specialty: formData.role === 'Technician' ? formData.specialty : null
      };

      if (isEditing) {
          // UPDATE
          const response = await updateUser(editUserId, dataToSend);
          setUsers(users.map(u => (u._id || u.id) === editUserId ? response.user : u));
          showNotification("User updated successfully!", "success");
      } else {
          // CREATE
          const newUser = await createUser(dataToSend);
          setUsers([newUser.user, ...users]);
          showNotification("User created successfully!", "success");
      }
      setShowModal(false);
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Helper for Badge Colors
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin": return styles.roleAdmin;
      case "Manager": return styles.roleManager;
      case "Technician": return styles.roleTechnician;
      case "Employee": return styles.roleEmployee;
      default: return styles.roleCustomer;
    }
  };

  if (loading) return <div className={styles.loading}>Loading System...</div>;

  // --- RENDER CONTENT ---
  const renderTabContent = () => {
    switch (activeTab) {
      
      // TAB 1: OVERVIEW (Διατηρήθηκε)
      case "Overview":
        return (
          <>
            <div className={styles.statsGrid}>
              <StatCard label="Total Tickets" value={stats.total} icon="📦" color="#2563eb" />
              <StatCard label="Open Requests" value={stats.pending} icon="🕒" color="#f59e0b" />
              <StatCard label="Completed" value={stats.completed} icon="✅" color="#10b981" />
              <StatCard label="In Warranty" value={stats.underWarranty} icon="🛡️" color="#3b82f6" />
            </div>

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3>Efficiency Rate</h3>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${stats.completedRate}%`, backgroundColor: "#10b981" }}></div>
                </div>
                <span className={styles.progressValue}>{stats.completedRate.toFixed(1)}% Resolved</span>
              </div>
              <div className={styles.chartCard}>
                <h3>Warranty Coverage</h3>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${stats.warrantyRate}%`, backgroundColor: "#3b82f6" }}></div>
                </div>
                <span className={styles.progressValue}>{stats.warrantyRate.toFixed(1)}% Under Guarantee</span>
              </div>
            </div>

            <div className={styles.tableSection}>
              <div className={styles.sectionHeader}>
                <h2>Recent Activity (Last 5)</h2>
                <button className={styles.viewAllBtn} onClick={() => setActiveTab("All Tickets")}>View Full List</button>
              </div>
              <TicketTable data={tickets.slice(0, 5)} />
            </div>
          </>
        );

      // TAB 2: ALL TICKETS (Διατηρήθηκε)
      case "All Tickets":
        return (
          <div className={styles.tableSection}>
            <div className={styles.filterBar}>
              <input 
                type="text" placeholder="Search by ID or Customer..." className={styles.searchInput}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <TicketTable data={filteredTickets} />
          </div>
        );

      // TAB 3: USER MANAGEMENT (Ενημερωμένο)
      case "User Management":
        return (
          <div className={styles.tableSection}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2>System Users</h2>
              <button className={styles.btnSubmit} onClick={openCreateModal}>+ Create User</button>
            </div>

            <table className={styles.miniTable}>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Specialty</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td><span className={`${styles.badge} ${getRoleBadgeClass(u.role)}`}>{u.role}</span></td>
                    <td>{u.specialty || "-"}</td>
                    <td>
                      {/* Edit Button */}
                      <button className={styles.actionBtn} onClick={() => openEditModal(u)} title="Edit User">✏️</button>
                      {/* Delete Button */}
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => initiateDelete(u)} title="Delete User">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className={styles.placeholderView}>
            <h2>{activeTab}</h2>
            <p>This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div><h1>Admin Dashboard</h1><p className={styles.welcomeText}>Electronics Returns & Repairs Management</p></div>
      </header>

      <nav className={styles.tabsNav}>
        {["Overview", "All Tickets", "User Management", "Reports", "Settings"].map((tab) => (
          <button key={tab} className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>

      <main>{renderTabContent()}</main>

      {/* --- CREATE / EDIT MODAL --- */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{isEditing ? 'Edit User' : 'Create New User'}</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              
              {!isEditing && (
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="Customer">Customer</option>
                  <option value="Technician">Technician</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              {formData.role === "Technician" && (
                <div className={`${styles.formGroup} ${styles.highlightGroup}`}>
                  <label>Specialty</label>
                  <select value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Desktop">Desktop</option>
                  </select>
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.btnCancel}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <span className={styles.spinner}></span> : (isEditing ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{textAlign: 'center', maxWidth: '350px'}}>
              <h3 style={{color: '#ef4444'}}>Delete User?</h3>
              <p>Are you sure you want to delete <strong>{userToDelete?.fullName}</strong>?</p>
              <div className={styles.modalActions} style={{justifyContent: 'center', marginTop: '1.5rem'}}>
                  <button onClick={() => setShowDeleteConfirm(false)} className={styles.btnCancel}>Cancel</button>
                  <button onClick={confirmDelete} className={styles.btnSubmit} style={{backgroundColor: '#ef4444'}}>Yes, Delete</button>
              </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Component για τον Πίνακα Tickets (Διατηρήθηκε)
const TicketTable = ({ data }) => (
  <table className={styles.miniTable}>
    <thead>
      <tr><th>Ticket ID</th><th>Customer</th><th>Status</th><th>Warranty</th></tr>
    </thead>
    <tbody>
      {data.map((t) => (
        <tr key={t._id}>
          <td className={styles.idCell}>#{t.ticketId || t._id.substring(0, 6)}</td>
          <td>{t.contactInfo?.fullName || "N/A"}</td>
          <td>
            <span className={`${styles.badge} ${styles[t.status?.toLowerCase().replace(/ /g, "-")] || styles.submitted}`}>
              {t.status}
            </span>
          </td>
          <td className={styles.warrantyCell}>{t.warrantyStatus}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Component για τα Stats Cards (Διατηρήθηκε)
const StatCard = ({ label, value, icon, color }) => (
  <div className={styles.statCard}>
    <div className={styles.iconBox} style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div className={styles.cardInfo}>
      <h3 className={styles.statLabel}>{label}</h3>
      <p className={styles.statValue}>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;