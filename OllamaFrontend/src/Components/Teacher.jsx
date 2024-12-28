import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, CheckCircle, XCircle, Users } from "lucide-react";

const TeacherDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all students from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8080/api/attendance/students"); // Replace with your actual backend API endpoint
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch students.");
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Update attendance status locally
  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Submit attendance to the backend
  const handleSubmit = async () => {
    const attendanceRequests = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId: parseInt(studentId),
      date: selectedDate,
      status,
    }));

    try {
      setLoading(true);
      setError(null);
      await axios.post("http://localhost:8080/api/attendance/mark", attendanceRequests); // Replace with your actual backend API endpoint
      setLoading(false);
      alert("Attendance submitted successfully.");
    } catch (err) {
      setError("Failed to submit attendance.");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="display-5 fw-bold">Teacher Dashboard</h1>
        </div>
        <div className="col-auto">
          <div className="d-flex align-items-center gap-3">
            <Clock className="text-primary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <Users className="text-primary me-2" />
                <h5 className="card-title mb-0">Total Students</h5>
              </div>
              <h2 className="display-6 text-primary">{students.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <CheckCircle className="text-success me-2" />
                <h5 className="card-title mb-0">Present Today</h5>
              </div>
              <h2 className="display-6 text-success">
                {Object.values(attendanceData).filter((status) => status === "PRESENT").length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <XCircle className="text-danger me-2" />
                <h5 className="card-title mb-0">Absent Today</h5>
              </div>
              <h2 className="display-6 text-danger">
                {Object.values(attendanceData).filter((status) => status === "ABSENT").length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Mark Attendance</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(student.id, "PRESENT")}
                          className={`btn ${
                            attendanceData[student.id] === "PRESENT"
                              ? "btn-success"
                              : "btn-outline-success"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(student.id, "ABSENT")}
                          className={`btn ${
                            attendanceData[student.id] === "ABSENT"
                              ? "btn-danger"
                              : "btn-outline-danger"
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-4">
            <button onClick={handleSubmit} className="btn btn-primary btn-lg">
              Submit Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
