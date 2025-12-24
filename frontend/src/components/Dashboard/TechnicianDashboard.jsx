import { useEffect, useState } from 'react';
import { getAssignedTickets } from '@/services/ticketService';
import styles from './TechnicianDashboard.module.css';

const TechnicianDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssignedTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error loading tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className={styles.container}>Loading tasks...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🔧 Technician Dashboard</h2>
        <p className={styles.subtitle}>Welcome back. Here are your assigned repairs.</p>
      </div>

      {tickets.length === 0 ? (
        <div className={styles.emptyState}>
          No tickets assigned to you yet.
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Ticket ID</th>
                <th className={styles.th}>Model</th>
                <th className={styles.th}>Issue</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id} className={styles.tr}>
                  <td className={styles.td}>{ticket.ticketId}</td>
                  <td className={styles.td}>
                    <span className={styles.productModel}>{ticket.product.model}</span>
                    <span className={styles.productType}>{ticket.product.type}</span>
                  </td>
                  <td className={styles.td}>{ticket.issue.description.substring(0, 30)}...</td>
                  <td className={styles.td}>
                    <span className={styles.statusBadge}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className={styles.td}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;