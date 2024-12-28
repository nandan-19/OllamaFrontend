package p1.EduMatrix.Attendance.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import p1.EduMatrix.Attendance.Repository.AttendanceRepository;
import p1.EduMatrix.Attendance.Repository.StudentRepository;
import p1.EduMatrix.Attendance.dto.AttendanceRequestDTO;
import p1.EduMatrix.Attendance.dto.StudentAttendanceDTO;
import p1.EduMatrix.Attendance.model.Attendance;
import p1.EduMatrix.Attendance.model.Student;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Setter
@Getter
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Attendance> markAttendance(List<AttendanceRequestDTO> attendanceRequests) {
        List<Attendance> attendances = attendanceRequests.stream()
                .map(request -> {
                    // Fetch existing attendance record
                    Optional<Attendance> existingAttendance = attendanceRepository.findByStudentIdAndSubjectAndDate(
                            request.getStudentId(), request.getSubject(), request.getDate()
                    );

                    Attendance attendance = existingAttendance.orElseGet(() -> {
                        Attendance newAttendance = new Attendance();
                        newAttendance.setStudent(studentRepository.findById(request.getStudentId()).orElseThrow());
                        return newAttendance;
                    });

                    // Update or set attendance fields
                    attendance.setDate(request.getDate());
                    attendance.setSubject(request.getSubject());
                    attendance.setStatus(request.getStatus());

                    return attendance;
                })
                .collect(Collectors.toList());

        return attendanceRepository.saveAll(attendances);
    }

    public List<StudentAttendanceDTO> getAttendanceForStudent(Long studentId) {
        List<Attendance> attendances = attendanceRepository.findByStudentId(studentId);
        return attendances.stream()
                .map(att -> new StudentAttendanceDTO(att.getDate(), att.getSubject(), att.getStatus()))
                .collect(Collectors.toList());
    }
}
