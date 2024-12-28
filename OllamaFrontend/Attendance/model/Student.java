package p1.EduMatrix.Attendance.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String mongoId; // OAuth-related ID for unique identification.

    // Getters and Setters
}

