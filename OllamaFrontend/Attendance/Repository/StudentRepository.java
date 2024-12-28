package p1.EduMatrix.Attendance.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p1.EduMatrix.Attendance.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
}