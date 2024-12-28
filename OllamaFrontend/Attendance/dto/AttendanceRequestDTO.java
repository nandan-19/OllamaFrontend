package p1.EduMatrix.Attendance.dto;

import lombok.Getter;
import lombok.Setter;
import p1.EduMatrix.Attendance.model.AttendanceStatus;


import java.time.LocalDate;

@Getter
@Setter
public class AttendanceRequestDTO {
    private Long studentId;
    private String subject;
    private LocalDate date;
    private AttendanceStatus status;

    // Getters and Setters
}

