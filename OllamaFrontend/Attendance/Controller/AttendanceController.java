package p1.EduMatrix.Attendance.Controller;

import org.springframework.web.bind.annotation.*;
import p1.EduMatrix.Attendance.dto.AttendanceRequestDTO;
import p1.EduMatrix.Attendance.dto.StudentAttendanceDTO;
import p1.EduMatrix.Attendance.model.Attendance;
import p1.EduMatrix.Attendance.model.Student;
import p1.EduMatrix.Attendance.service.AttendanceService;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return attendanceService.getAllStudents();
    }

    @PostMapping("/mark")
    public List<Attendance> markAttendance(@RequestBody List<AttendanceRequestDTO> attendanceRequests) {
        return attendanceService.markAttendance(attendanceRequests);
    }

    @GetMapping("/view/{studentId}")
    public List<StudentAttendanceDTO> getAttendanceForStudent(@PathVariable Long studentId) {
        return attendanceService.getAttendanceForStudent(studentId);
    }
}

