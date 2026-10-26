# Secure Legal Case, Client & Court Diary Management System

A web application being developed to organize legal cases, client records, and court diary activities in one place.

**Status: initial development.** The frontend, backend, and PostgreSQL connection are initialized. The initial database schema is managed by Flyway. Business modules and frontend-to-backend data flows are still to be implemented. A GitHub Actions CI workflow is included.

## Contents

- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Running the application](#running-the-application)
- [Docker Compose](#docker-compose)
- [Build and checks](#build-and-checks)
- [Continuous integration](#continuous-integration)
- [Development workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Planned work](#planned-work)

## Technology stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19, JavaScript | User interface |
| Frontend tooling | Vite 8, npm | Development server and production build |
| Styling | Tailwind CSS 4 | Utility-based styling |
| Code quality | ESLint 10 | Frontend lint checks |
| Backend | Java 21, Spring Boot 4.1.1 | Backend application |
| Web layer | Spring Web MVC | Foundation for HTTP APIs |
| Security | Spring Security | Default development login currently enabled |
| Persistence | Spring Data JPA, Hibernate, PostgreSQL JDBC | Database access |
| Database | PostgreSQL 18 | Relational database |
| Migrations | Flyway | Versioned PostgreSQL schema migrations |
| Validation | Spring Validation | Foundation for request validation |
| Build and tests | Maven Wrapper, JUnit, Spring Boot Test | Backend build and integration checks |
| Automation | GitHub Actions | Backend and frontend CI |

Exact dependencies are recorded in [pom.xml](backend/pom.xml), [package.json](frontend/package.json), and the frontend lockfile. H2 dependencies are also present, but PostgreSQL is the configured application database.

## Project structure

```text
.
|-- .github/workflows/ci.yml             # GitHub Actions
|-- backend/
|   |-- .mvn/wrapper/                   # Maven Wrapper configuration
|   |-- src/main/java/                  # Backend source
|   |-- src/main/resources/
|   |   |-- application.properties      # Shared configuration
|   |   `-- application-local.properties.example
|   |-- src/test/java/                  # Backend tests
|   |-- mvnw                            # Unix wrapper
|   |-- mvnw.cmd                        # Windows wrapper
|   `-- pom.xml
|-- frontend/
|   |-- src/                            # React source and styles
|   |-- package.json
|   |-- package-lock.json
|   `-- vite.config.js
`-- README.md
```

The local credentials file, `backend/src/main/resources/application-local.properties`, is created on your machine and ignored by Git.

## Prerequisites

- Git
- JDK **21**, with `JAVA_HOME` configured
- Node.js **24** and npm, matching CI
- PostgreSQL **18**, running locally
- A terminal and an editor such as VS Code
- Optional: pgAdmin for database administration

Maven is downloaded by the included wrapper; a separate Maven installation is unnecessary. Initial dependency downloads require internet access.

## Getting started

These commands use **Windows PowerShell**. Start from the repository root unless stated otherwise.

### 1. Clone the repository

```powershell
git clone https://github.com/Iresha2002/Legal-Case-Client-Court-Diary-Management-System-.git
cd Legal-Case-Client-Court-Diary-Management-System-
```

### 2. Prepare an empty PostgreSQL database

Create an empty database using pgAdmin or PostgreSQL administration tools, for example `legal_diary`.

Use a dedicated application login with a strong password. The application login needs connection, schema usage, table CRUD, and sequence usage permissions. Flyway needs a schema owner login to create tables; set DB_MIGRATION_USERNAME and DB_MIGRATION_PASSWORD separately when the application login has limited permissions. If omitted, Flyway uses the application credentials. Perform administrative setup separately from the application.

In pgAdmin, server **Properties → Connection** shows the host, port, and login username. Find your database name under **Databases**. The database owner and login username are not necessarily the same.

### 3. Configure local credentials

```powershell
Copy-Item backend/src/main/resources/application-local.properties.example backend/src/main/resources/application-local.properties
```

Open the new `application-local.properties` file and replace the example values:

```properties
DB_URL=jdbc:postgresql://localhost:5432/legal_diary
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

- Replace `legal_diary` with the database name you actually created.
- Use PostgreSQL login credentials, which may differ from pgAdmin's master password.
- Do not surround values with quotes. Save the file before starting the backend.
- Leave `${DB_URL}`, `${DB_USERNAME}`, and `${DB_PASSWORD}` in shared configuration unchanged.
- Never commit the local credentials file or place passwords in shared configuration.

Environment variables with the same names can supply these settings instead. A plain `.env` file is not automatically loaded by this backend configuration.

### 4. Database initialization scope

Create the database first. On startup, Flyway applies pending migrations from `backend/src/main/resources/db/migration/`:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.sql.init.mode=never
spring.flyway.enabled=true
```

Flyway V1 creates the 10 ER tables and its own `flyway_schema_history` table. Hibernate validates the schema without modifying it; SQL initialization scripts remain disabled. Never edit an applied migration: add V2, V3, and so on. Existing non-empty databases are not automatically baselined; review them before migration.

## Running the application

Keep backend and frontend running in **two separate terminals**.

### Terminal 1: backend

From the repository root:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Wait for `Started DiaryBackendApplication`. The terminal stays occupied while the server handles requests; this is normal.

| Service | Local address |
| --- | --- |
| Backend | http://localhost:8080 |
| Default security login | http://localhost:8080/login |
| Frontend | Usually http://localhost:5173; use the URL printed by Vite |

The login page confirms HTTP availability. Its credentials are separate from PostgreSQL credentials. Spring Security currently uses the development username `user` and a generated password printed in backend startup logs. Application-specific authentication is still to be implemented.

### Terminal 2: frontend

Open a new terminal at the repository root:

```powershell
cd frontend
npm ci
npm run dev
```

Open the URL printed by Vite. It may select a different port if the default is occupied. Run `npm ci` for a fresh checkout or after lockfile changes.

The frontend currently displays the project heading. Business screens and API integration are planned.

Press `Ctrl+C` in the relevant terminal to stop either server.

### macOS / Linux

Use the same frontend commands. In `backend`, use:

```sh
sh ./mvnw spring-boot:run
```

Copy the example properties file using your editor or `cp`.

## Docker Compose

This optional local setup starts frontend, backend, and a separate PostgreSQL 18
database. Install Docker Desktop with Linux containers and start its engine first.
Your existing locally installed PostgreSQL database is not changed or imported.

From the repository root, create the Compose settings file once:

```powershell
Copy-Item .env.example .env
```

Open `.env`, replace both password examples with different strong passwords, and
save it. This file is ignored by Git. For passwords containing `$` or `#`, use
single quotes around the entire value in `.env` to preserve it literally.
These Compose settings are independent of `application-local.properties`.
The backend local credentials file is excluded from its Docker build context.

Stop any existing frontend/backend servers with `Ctrl+C` before using the same
ports. Alternatively, set `COMPOSE_BACKEND_PORT=8081` and
`COMPOSE_FRONTEND_PORT=5174` in `.env`.

```powershell
docker compose up --build -d --wait
docker compose ps
```

With the default ports, open **http://localhost:5173** for the frontend and
**http://localhost:8080/login** to check backend availability.

- PostgreSQL initializes an empty database in a persistent named volume.
- An initialization script creates the `diary_app` login with connection
  and data access permissions, separate from the administrator. Flyway uses the administrator login to apply migrations; the application continues using `diary_app`.
- Backend startup waits for PostgreSQL health; frontend startup waits for the
  backend login endpoint to respond.
- PostgreSQL has no published host port. Backend connects using the Compose
  service hostname `postgres`; your host PostgreSQL can continue using port 5432.
- Application ports are bound to the local machine only.
- The frontend uses Vite's development server. Source edits require a rebuild;
  this setup does not mount your source directories for hot reload.
- Backend image packaging skips tests because the database is unavailable during
  image builds. Run tests separately or use CI before merging.

View logs and stop the stack:

```powershell
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
docker compose down
```

`down` keeps the database volume. Initial database credentials and role creation
are applied only to a new volume: editing `.env` does not change existing database
passwords. Change them through PostgreSQL administration when retaining data.
`docker compose down -v` deletes the database volume and all data in it; use it
only when intentionally discarding this Docker database.

This is a local development setup. Production deployment requires a separate
review of authentication, secrets, TLS, backups, and frontend serving.

### Existing Docker database volumes

The permissions initialization script runs automatically only for new volumes.
For a volume created before Flyway was enabled, start PostgreSQL and apply the
permissions once before rebuilding the backend (replace `legal_diary` if needed):

```powershell
docker compose up -d postgres
Get-Content docker/postgres/02-app-permissions.sql | docker compose exec -T postgres psql -U diary_admin -d legal_diary -v ON_ERROR_STOP=1
docker compose up --build -d --wait
```

This grants data access without granting schema creation to `diary_app` and
retains existing data. Flyway uses `diary_admin` to own and migrate the schema.

## Build and checks

### Backend

From `backend`, with PostgreSQL running and credentials configured:

```powershell
.\mvnw.cmd --batch-mode --no-transfer-progress clean verify
```

This compiles, runs tests, and packages an executable JAR in `backend/target/`. The application test loads Spring, opens a database connection, and verifies that the database is PostgreSQL.

Local builds can package the local credentials resource. Keep those JARs private. Create release artifacts in a clean environment without the local credentials file and supply secrets externally.

### Frontend

From `frontend`:

```powershell
npm run lint
npm run build
```

The production output is generated in `frontend/dist/`. To preview that build:

```powershell
npm run preview
```

## Continuous integration

The [CI workflow](.github/workflows/ci.yml) runs:

- On pushes to `dev`, `main`, and `feature/**` branches.
- On pull requests targeting `dev` or `main`.
- Manually through GitHub Actions when the workflow is available on the default branch.

| Job | Checks |
| --- | --- |
| Backend build and tests | Java 21, Maven Wrapper `clean verify`, PostgreSQL 18 service |
| Frontend lint and build | Node.js 24, `npm ci`, ESLint, Vite production build |

Jobs run independently. Backend CI uses a fresh PostgreSQL service with disposable credentials; local passwords and repository secrets are unnecessary. Flyway applies and tests the initial schema in the temporary CI database.

The workflow includes dependency caching, timeouts, read-only repository permissions, and cancellation of superseded runs on the same ref. Check both results under **GitHub → Actions** before merging.

Required checks must be configured separately using GitHub branch protection or rulesets; adding this workflow does not enforce merge restrictions automatically.

## Development workflow

Start feature work from an up-to-date `dev` branch:

```powershell
git switch dev
git pull --ff-only origin dev
git switch -c feature/your-feature-name
```

Run relevant checks, review your diff for credentials, then commit and push your changes. Open a pull request targeting `dev`. Keep dependency lockfiles under version control.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `Port 8080 was already in use` | Stop the earlier backend instance with `Ctrl+C`. If another service owns the port, identify it before stopping it. |
| `npm error Missing script: "dev"` | Run inside `frontend`. From `backend`, use `cd ..\frontend`. |
| Vite or React plugin cannot be found | Run `npm ci` inside `frontend`, then retry. |
| Database connection refused | Check that PostgreSQL is running and the URL host/port match. |
| Password authentication failed | Check the PostgreSQL login and password in the saved local file. |
| Database does not exist | Create it first and match its name in `DB_URL`. |
| URL must start with `jdbc`, or unresolved placeholder | Check the local file name, configuration import, and all three `DB_*` values. |
| Login page appears | Default Spring Security is enabled. Application authentication/API rules are still to be implemented. |
| No output after `Started DiaryBackendApplication` | Normal: the server is waiting for requests. Open the login URL. |
| No tables appear | Check Flyway startup logs, the selected database, and migration permissions. |

## Planned work

- Map the migrated schema to JPA entities and repositories.
- Implement application authentication and authorization.
- Build legal case, client, and court diary modules.
- Connect frontend screens to backend APIs and expand tests.
- Add automated Docker image and Compose smoke checks to CI.

These are intended next steps, not features currently available.
