package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.Client;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClientRepository extends JpaRepository<Client, Long> {

    // Explicit query prevents "Or" in the field name being parsed as an operator.
    @Query("select client from Client client where client.nicOrPassport = :identity")
    Optional<Client> findByNicOrPassport(@Param("identity") String nicOrPassport);
}
