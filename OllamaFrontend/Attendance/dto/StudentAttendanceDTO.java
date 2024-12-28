package p1.EduMatrix.Attendance.dto;

import lombok.Getter;
import lombok.Setter;
import p1.EduMatrix.Attendance.model.AttendanceStatus;
import java.time.LocalDate;

@Setter
@Getter
public class StudentAttendanceDTO {
    // Getters and Setters
    private LocalDate date;
    private String subject;
    private AttendanceStatus status;

    public StudentAttendanceDTO(LocalDate date, String subject, AttendanceStatus status) {
        this.date = date;
        this.subject = subject;
        this.status = status;
    }

}
