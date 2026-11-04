package com.legal.diary_backend;

import java.sql.Connection;
import javax.sql.DataSource;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class DiaryBackendApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Test
	void connectsToPostgresql() throws Exception {
		try (Connection connection = dataSource.getConnection()) {
			assertTrue(connection.isValid(5));
			assertEquals("PostgreSQL", connection.getMetaData().getDatabaseProductName());
		}
	}

	@Test
	void flywayCreatesTheApprovedSchema() throws Exception {
		try (Connection connection = dataSource.getConnection()) {
			for (String table : new String[] {"roles", "users", "clients", "cases",
					"case_assignments", "hearings", "diary_notes", "document_types",
					"documents", "activity_history"}) {
				try (var tables = connection.getMetaData().getTables(null, "public", table, new String[] {"TABLE"})) {
					assertTrue(tables.next(), "Missing table: " + table);
				}
			}
			try (var statement = connection.createStatement();
				 var result = statement.executeQuery(
					 "SELECT count(*) FROM flyway_schema_history WHERE version = '1' AND success")) {
				assertTrue(result.next());
				assertEquals(1, result.getInt(1));
			}
		}
	}

}
