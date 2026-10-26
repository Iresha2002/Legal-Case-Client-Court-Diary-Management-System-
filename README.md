# Secure Legal Case, Client & Court Diary Management System

## Local database setup

Install Java 21 and PostgreSQL, and create an empty database. Use a dedicated
PostgreSQL login for the application rather than the `postgres` administrator.
Grant the login permission to connect to the database. No table permissions
are needed at this stage.

Copy `backend/src/main/resources/application-local.properties.example` to
`backend/src/main/resources/application-local.properties` and replace its three
example values. The local credentials file is ignored by Git; never commit it.
Environment variables `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` can also supply
these settings instead of the local file.

Hibernate schema creation, SQL initialization, and Flyway are disabled. Starting
the backend connects to the existing database without creating tables, including
the Flyway history table. Enable versioned migrations when schema work begins.

From a PowerShell terminal in `backend`, start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend uses port 8080. Spring Security's default login is enabled.

## Local frontend

From a separate terminal in `frontend`:

```powershell
npm install
npm run dev
```

Open the URL printed by Vite. Keep both terminals running.
