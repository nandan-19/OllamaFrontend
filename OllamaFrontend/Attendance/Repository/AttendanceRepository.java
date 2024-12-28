package p1.EduMatrix.Attendance.Repository;

import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.stereotype.Repository;
import p1.EduMatrix.Attendance.model.Attendance;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentIdAndSubjectAndDate(Long studentId, String subject, LocalDate date);

    List<Attendance> findByStudentId(Long studentId);
}
