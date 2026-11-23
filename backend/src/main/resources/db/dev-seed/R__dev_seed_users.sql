-- DEVELOPMENT ONLY: test roles and users so every teammate can log in.
-- Flyway reads this folder only when the "dev" Spring profile is active
-- (see application-dev.properties). It never runs in production.
--
-- Test accounts (all use the password DevPass123!):
--   senior@lexis.test  -> Senior Lawyer
--   junior@lexis.test  -> Junior Lawyer
--   clerk@lexis.test   -> Clerk
--
-- This is a repeatable migration (R__): Flyway runs it again whenever this file
-- changes. Every insert is skipped if the row already exists, so it is safe to
-- run many times and never touches users you created yourself.
--
-- To change the password, generate a new BCrypt hash (Spring's BCryptPasswordEncoder)
-- and replace the hash below.

-- Roles (the names must match AppRole exactly).
INSERT INTO roles (name)
SELECT r.name
FROM (VALUES ('Senior Lawyer'), ('Junior Lawyer'), ('Clerk')) AS r(name)
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE roles.name = r.name);

-- Users. The hash is BCrypt for DevPass123!
INSERT INTO users (name, email, password_hash, role_id, is_active)
SELECT u.name,
       u.email,
       '$2a$10$y6NeUGwXa0Bc2oMmp.tSzevfcWqUHn/8La4jKwOGR6W9R/SM.ioZq',
       (SELECT MIN(id) FROM roles WHERE roles.name = u.role_name),
       true
FROM (VALUES
        ('Dev Senior Lawyer', 'senior@lexis.test', 'Senior Lawyer'),
        ('Dev Junior Lawyer', 'junior@lexis.test', 'Junior Lawyer'),
        ('Dev Clerk',         'clerk@lexis.test',  'Clerk')
     ) AS u(name, email, role_name)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE lower(users.email) = u.email);
