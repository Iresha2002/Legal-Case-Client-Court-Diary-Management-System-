package com.legal.diary_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

@Entity
@Table(name = "documents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_type_id", nullable = false)
    private DocumentType documentType;

    @Setter
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Setter
    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Setter
    @Column(name = "storage_path", nullable = false)
    private String storagePath;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    // Use the CURRENT_TIMESTAMP default defined in the migration.
    @Generated(event = EventType.INSERT)
    @Column(name = "uploaded_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime uploadedAt;

    public Document(LegalCase legalCase, DocumentType documentType, String fileName,
                    Long fileSize, String storagePath, User uploadedBy) {
        this.legalCase = legalCase;
        this.documentType = documentType;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.storagePath = storagePath;
        this.uploadedBy = uploadedBy;
    }
}
