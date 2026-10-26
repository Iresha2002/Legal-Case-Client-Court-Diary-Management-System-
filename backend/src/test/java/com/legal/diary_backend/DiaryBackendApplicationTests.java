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

}
