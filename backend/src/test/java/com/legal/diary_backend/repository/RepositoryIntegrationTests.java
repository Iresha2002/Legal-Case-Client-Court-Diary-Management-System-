package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.*;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Every test rolls back its data, including expected constraint failures.
class RepositoryIntegrationTests {

    @Autowired private RoleRepository roles;
    @Autowired private UserRepository users;
    @Autowired private ClientRepository clients;
    @Autowired private LegalCaseRepository cases;
    @Autowired private CaseAssignmentRepository assignments;
    @Autowired private HearingRepository hearings;
    @Autowired private DiaryNoteRepository notes;
    @Autowired private DocumentTypeRepository documentTypes;
    @Autowired private DocumentRepository documents;
    @Autowired private ActivityHistoryRepository activities;
    @Autowired private EntityManager entityManager;

    private Role role;
    private User user;
    private Client client;
    private LegalCase legalCase;

    @BeforeEach
    void createRelatedRecords() {
        String token = UUID.randomUUID().toString();
        role = roles.save(new Role("Junior Lawyer"));
        user = users.save(new User("Test lawyer", token + "@example.invalid", "test-hash", role));
        client = clients.save(new Client("Test client", token));
        legalCase = cases.saveAndFlush(new LegalCase(token, "Civil", "Colombo", "ongoing", "Active", client));
    }

    private void reloadFromDatabase() {
        entityManager.flush();
        entityManager.clear();
    }

    @Test
    void readsAndUpdatesCoreRecords() {
        reloadFromDatabase();
        User loadedUser = users.findByEmail(user.getEmail()).orElseThrow();
        assertEquals(role.getId(), loadedUser.getRole().getId());
        assertEquals("Junior Lawyer", loadedUser.getRole().getName());
        assertEquals("test-hash", loadedUser.getPasswordHash());
        assertTrue(loadedUser.isActive());
        loadedUser.setActive(false);
        loadedUser.getRole().setName("Senior Lawyer");

        Client loadedClient = clients.findByNicOrPassport(client.getNicOrPassport()).orElseThrow();
        assertNull(loadedClient.getPhone());
        assertNull(loadedClient.getEmail());
        assertNull(loadedClient.getAddress());
        String address = "Colombo\n" + "Address line ".repeat(50);
        loadedClient.setAddress(address);

        LegalCase loadedCase = cases.findByCaseNumber(legalCase.getCaseNumber()).orElseThrow();
        assertEquals(client.getId(), loadedCase.getClient().getId());
        loadedCase.setStatus("past");
        loadedCase.setLifecycleStatus("Closed");
        reloadFromDatabase();

        assertFalse(users.findById(user.getId()).orElseThrow().isActive());
        assertEquals("Senior Lawyer", roles.findById(role.getId()).orElseThrow().getName());
        assertEquals(address, clients.findById(client.getId()).orElseThrow().getAddress());
        assertEquals("Closed", cases.findById(legalCase.getId()).orElseThrow().getLifecycleStatus());
        assertEquals("past", cases.findById(legalCase.getId()).orElseThrow().getStatus());
    }

    @Test
    void filtersAssignmentsAndOrdersHearings() {
        CaseAssignment assignment = assignments.save(new CaseAssignment(legalCase, user, "lead"));
        LocalDate day = LocalDate.of(2040, 1, 2);
        Hearing late = hearings.save(new Hearing(legalCase, day, LocalTime.of(14, 0)));
        Hearing early = hearings.save(new Hearing(legalCase, day, LocalTime.of(9, 0)));
        Hearing tomorrow = hearings.save(new Hearing(legalCase, day.plusDays(1), LocalTime.of(8, 0)));
        reloadFromDatabase();

        assertEquals(List.of(assignment.getId()), assignments.findByLegalCase_Id(legalCase.getId())
                .stream().map(CaseAssignment::getId).toList());
        assertEquals(List.of(assignment.getId()), assignments.findByUser_Id(user.getId())
                .stream().map(CaseAssignment::getId).toList());
        assertEquals(List.of(early.getId(), late.getId(), tomorrow.getId()),
                hearings.findByLegalCase_IdOrderByHearingDateAscHearingTimeAsc(legalCase.getId())
                        .stream().map(Hearing::getId).toList());
        assertEquals(List.of(early.getId(), late.getId()), hearings.findByHearingDateOrderByHearingTimeAsc(day)
                .stream().filter(h -> h.getLegalCase().getId().equals(legalCase.getId())).map(Hearing::getId).toList());
        assertTrue(assignments.findByUser_Id(-1L).isEmpty());
    }

    @Test
    void supportsOptionalHearingAndDatabaseGeneratedNoteTimestamp() {
        Hearing hearing = hearings.save(new Hearing(legalCase, LocalDate.of(2040, 1, 2), LocalTime.NOON));
        DiaryNote general = notes.saveAndFlush(new DiaryNote(legalCase, "General note", user));
        DiaryNote hearingNote = new DiaryNote(legalCase, "Hearing note", user);
        hearingNote.setHearing(hearing);
        notes.saveAndFlush(hearingNote);
        assertNotNull(general.getCreatedAt());
        assertNotNull(hearingNote.getCreatedAt());
        var createdAt = hearingNote.getCreatedAt();
        reloadFromDatabase();

        assertNull(notes.findById(general.getId()).orElseThrow().getHearing());
        DiaryNote loaded = notes.findById(hearingNote.getId()).orElseThrow();
        assertEquals(user.getId(), loaded.getWrittenBy().getId());
        assertEquals(hearing.getId(), loaded.getHearing().getId());
        assertEquals(List.of(hearingNote.getId(), general.getId()),
                notes.findByLegalCase_IdOrderByCreatedAtDescIdDesc(legalCase.getId())
                        .stream().map(DiaryNote::getId).toList());
        assertEquals(List.of(hearingNote.getId()), notes.findByHearing_IdOrderByCreatedAtDescIdDesc(hearing.getId())
                .stream().map(DiaryNote::getId).toList());
        loaded.setNoteText("Updated note");
        reloadFromDatabase();
        assertEquals(createdAt, notes.findById(loaded.getId()).orElseThrow().getCreatedAt());
        assertEquals("Updated note", notes.findById(loaded.getId()).orElseThrow().getNoteText());
    }

    @Test
    void storesDocumentMetadataAndFiltersByCaseAndType() {
        DocumentType evidence = documentTypes.save(new DocumentType("Evidence"));
        DocumentType orders = documentTypes.save(new DocumentType("Orders"));
        Document first = documents.saveAndFlush(new Document(legalCase, evidence, "evidence.pdf", 42L, "test/evidence.pdf", user));
        Document second = documents.saveAndFlush(new Document(legalCase, orders, "order.pdf", 0L, "test/order.pdf", user));
        assertNotNull(first.getUploadedAt());
        assertNotNull(second.getUploadedAt());
        reloadFromDatabase();

        Document loaded = documents.findById(first.getId()).orElseThrow();
        assertEquals(42L, loaded.getFileSize());
        assertEquals("test/evidence.pdf", loaded.getStoragePath());
        assertEquals(user.getId(), loaded.getUploadedBy().getId());
        assertEquals("Evidence", loaded.getDocumentType().getName());
        assertEquals(List.of(second.getId(), first.getId()),
                documents.findByLegalCase_IdOrderByUploadedAtDescIdDesc(legalCase.getId())
                        .stream().map(Document::getId).toList());
        assertEquals(List.of(first.getId()),
                documents.findByLegalCase_IdAndDocumentType_IdOrderByUploadedAtDescIdDesc(legalCase.getId(), evidence.getId())
                        .stream().map(Document::getId).toList());
        documents.delete(loaded);
        reloadFromDatabase();
        assertFalse(documents.existsById(first.getId()));
        assertTrue(cases.existsById(legalCase.getId()));
        assertTrue(users.existsById(user.getId()));
        assertTrue(documentTypes.existsById(evidence.getId()));
    }

    @Test
    void storesOptionalActivityValuesAndOrdersByDateTimeAndId() {
        LocalDate day = LocalDate.of(2040, 1, 2);
        ActivityHistory global = activities.save(new ActivityHistory("view", user, day, LocalTime.of(8, 0)));
        ActivityHistory first = new ActivityHistory("edit", user, day, LocalTime.of(9, 0));
        first.setLegalCase(legalCase);
        first.setOldValue("Draft");
        first.setNewValue("Filed");
        activities.save(first);
        ActivityHistory second = new ActivityHistory("view", user, day, LocalTime.of(9, 0));
        second.setLegalCase(legalCase);
        activities.save(second);
        reloadFromDatabase();

        ActivityHistory loadedGlobal = activities.findById(global.getId()).orElseThrow();
        assertNull(loadedGlobal.getLegalCase());
        assertNull(loadedGlobal.getOldValue());
        assertNull(loadedGlobal.getNewValue());
        assertEquals("Draft", activities.findById(first.getId()).orElseThrow().getOldValue());
        assertEquals("Filed", activities.findById(first.getId()).orElseThrow().getNewValue());
        assertEquals(List.of(second.getId(), first.getId()),
                activities.findByLegalCase_IdOrderByDateDescTimeDescIdDesc(legalCase.getId())
                        .stream().map(ActivityHistory::getId).toList());
        assertEquals(List.of(second.getId(), first.getId(), global.getId()),
                activities.findByUser_IdOrderByDateDescTimeDescIdDesc(user.getId())
                        .stream().map(ActivityHistory::getId).toList());
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "nic", "caseNumber"})
    void rejectsDuplicateUniqueValues(String field) {
        assertThrows(DataIntegrityViolationException.class, () -> {
            switch (field) {
                case "email" -> users.saveAndFlush(new User("Duplicate", user.getEmail(), "test-hash", role));
                case "nic" -> clients.saveAndFlush(new Client("Duplicate", client.getNicOrPassport()));
                case "caseNumber" -> cases.saveAndFlush(new LegalCase(legalCase.getCaseNumber(), "Civil", "Colombo", "ongoing", "Draft", client));
                default -> fail("Unexpected test case");
            }
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {"status", "lifecycle", "assignment", "activity", "fileSize"})
    void rejectsValuesOutsideSchemaConstraints(String field) {
        assertThrows(DataIntegrityViolationException.class, () -> {
            switch (field) {
                case "status" -> { legalCase.setStatus("invalid"); cases.flush(); }
                case "lifecycle" -> { legalCase.setLifecycleStatus("invalid"); cases.flush(); }
                case "assignment" -> assignments.saveAndFlush(new CaseAssignment(legalCase, user, "invalid"));
                case "activity" -> activities.saveAndFlush(new ActivityHistory("invalid", user, LocalDate.of(2040, 1, 2), LocalTime.NOON));
                case "fileSize" -> {
                    DocumentType type = documentTypes.save(new DocumentType("Evidence"));
                    documents.saveAndFlush(new Document(legalCase, type, "file.pdf", -1L, "test/file.pdf", user));
                }
                default -> fail("Unexpected test case");
            }
        });
    }

    @Test
    void preventsDeletingRoleReferencedByUser() {
        reloadFromDatabase();
        roles.deleteById(role.getId());
        assertThrows(DataIntegrityViolationException.class, () -> roles.flush());
    }
}
