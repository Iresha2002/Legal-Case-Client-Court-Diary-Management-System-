package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // Used by login, so "Nimal@Firm.lk" and "nimal@firm.lk" find the same user.
    Optional<User> findByEmailIgnoreCase(String email);
}
