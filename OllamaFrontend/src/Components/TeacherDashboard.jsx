const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
  
    const markAttendance = async (studentId, present) => {
      setLoading(true);
      // API call to mark attendance
      setLoading(false);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
              <div className="flex items-center gap-2">
                <User className="w-6 h-6" />
                <span className="font-medium">Prof. Smith</span>
              </div>
            </div>
          </div>
  
          {/* Class Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mathematics - Class Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">ID: {student.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => markAttendance(student.id, true)}
                        variant={student.present ? "default" : "outline"}
                        className="w-28 flex items-center gap-2"
                        disabled={loading}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Present
                      </Button>
                      <Button
                        onClick={() => markAttendance(student.id, false)}
                        variant={!student.present ? "destructive" : "outline"}
                        className="w-28 flex items-center gap-2"
                        disabled={loading}
                      >
                        <XCircle className="w-4 h-4" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
  
          {/* Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                  </div>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Present Today</p>
                    <p className="text-2xl font-bold">
                      {students.filter(s => s.present).length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                    <p className="text-2xl font-bold">
                      {students.length ? 
                        Math.round((students.filter(s => s.present).length / students.length) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };


  export default { TeacherDashboard}  ;