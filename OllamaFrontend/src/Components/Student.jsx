import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import "./Attendance.css";

const StudentDashboard = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance history when component loads or studentId changes
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      // Replace with the correct studentId, e.g., from URL params or props
      const studentId = window.location.pathname.split('/').pop(); // Example of extracting studentId from the URL
      
      try {
        const response = await axios.get(`http://localhost:8080/api/attendance/view/${studentId}`);
        setAttendanceHistory(response.data); // Assuming API returns an array of records
      } catch (err) {
        setError('Error fetching attendance history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceHistory();
  }, []);

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="text-success" />;
      case 'ABSENT':
        return <XCircle className="text-danger" />;
      default:
        return <AlertCircle className="text-secondary" />;
    }
  };

  // Helper function to get status text color
  const getStatusClass = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'text-success';
      case 'ABSENT':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="display-5 fw-bold mb-4">Student Attendance History</h1>

      {loading && <div>Loading your attendance history...</div>}
      {error && <div className="text-danger">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Your Attendance Record</h5>
        </div>
        <div className="card-body">
          <div className="list-group">
            {attendanceHistory.length === 0 ? (
              <div>No attendance records found.</div>
            ) : (
              attendanceHistory.map((record, index) => (
                <div
                  key={index}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-3">
                    <Calendar className="text-primary" />
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {getStatusIcon(record.status)}
                    <span className={getStatusClass(record.status)}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
