package com.legal.diary_backend.auth;

import com.legal.diary_backend.entity.Role;
import com.legal.diary_backend.entity.User;
import com.legal.diary_backend.exception.InvalidPasswordException;
import com.legal.diary_backend.repository.RoleRepository;
import com.legal.diary_backend.repository.UserRepository;
import com.legal.diary_backend.service.PasswordService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Like RepositoryIntegrationTests: every test's users and roles are rolled back.
class AuthIntegrationTests {

    private static final String LOGIN_URL = "/api/v1/auth/login";
    private static final String LOGOUT_URL = "/api/v1/auth/logout";
    private static final String PASSWORD = "Correct-pass-1";
    private static final String GENERIC_LOGIN_ERROR = "Incorrect email or password.";
    private static final String NOT_LOGGED_IN_ERROR = "Please log in. Your token is missing, not valid or has expired.";

    @Autowired private MockMvc mockMvc;
    @Autowired private RoleRepository roles;
    @Autowired private UserRepository users;
    @Autowired private PasswordService passwordService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // ---------- Login ----------

    @ParameterizedTest
    @CsvSource({
            "Senior Lawyer, ROLE_SENIOR_LAWYER",
            "Junior Lawyer, ROLE_JUNIOR_LAWYER",
            "Clerk,         ROLE_CLERK"})
    void eachAllowedRoleCanLogIn(String roleName, String expectedAuthority) throws Exception {
        User user = createUser(roleName, true);

        login(user.getEmail(), PASSWORD)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(not(emptyOrNullString())))
                .andExpect(jsonPath("$.expiresAt").exists())
                .andExpect(jsonPath("$.userId").value(user.getId()))
                .andExpect(jsonPath("$.name").value(user.getName()))
                .andExpect(jsonPath("$.role").value(expectedAuthority))
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void emailIgnoresCaseAndSpaces() throws Exception {
        User user = createUser("Clerk", true);

        login("  " + user.getEmail().toUpperCase() + " ", PASSWORD)
                .andExpect(status().isOk());
    }

    @Test
    void wrongPasswordIsRefused() throws Exception {
        User user = createUser("Junior Lawyer", true);

        login(user.getEmail(), "Wrong-pass-1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value(GENERIC_LOGIN_ERROR));
    }

    @Test
    void unknownEmailGetsTheSameMessageAsWrongPassword() throws Exception {
        login("nobody-" + UUID.randomUUID() + "@example.invalid", PASSWORD)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(GENERIC_LOGIN_ERROR));
    }

    @Test
    void switchedOffAccountCannotLogIn() throws Exception {
        User user = createUser("Senior Lawyer", false);

        login(user.getEmail(), PASSWORD)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message")
                        .value("This account is switched off. Please contact the Senior Lawyer."))
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    void roleThatIsNotAllowedGetsTheGenericMessage() throws Exception {
        User user = createUser("Admin", true);

        login(user.getEmail(), PASSWORD)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(GENERIC_LOGIN_ERROR));
    }

    // ---------- Password rule ----------

    @Test
    void passwordShorterThan8CharactersIsRejectedOnLogin() throws Exception {
        User user = createUser("Clerk", true);

        login(user.getEmail(), "short")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Password must be at least 8 characters."));
    }

    @Test
    void passwordShorterThan8CharactersCannotBeHashed() {
        assertThrows(InvalidPasswordException.class, () -> passwordService.hash("1234567"));
        assertTrue(passwordService.matches("12345678", passwordService.hash("12345678")));
    }

    // ---------- Token check (logout is the protected endpoint used here) ----------

    @Test
    void protectedEndpointWorksWithTheTokenFromLogin() throws Exception {
        User user = createUser("Senior Lawyer", true);
        String token = tokenFrom(login(user.getEmail(), PASSWORD));

        mockMvc.perform(post(LOGOUT_URL).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void protectedEndpointWithoutTokenIsRefused() throws Exception {
        mockMvc.perform(post(LOGOUT_URL))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(NOT_LOGGED_IN_ERROR));
    }

    @Test
    void protectedEndpointWithBrokenTokenIsRefused() throws Exception {
        mockMvc.perform(post(LOGOUT_URL).header("Authorization", "Bearer not.a.real.token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(NOT_LOGGED_IN_ERROR));
    }

    @Test
    void expiredTokenIsRefused() throws Exception {
        // Signed with the real secret, so the only problem is that it expired an hour ago.
        Instant anHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        String expiredToken = Jwts.builder()
                .subject("1")
                .claim("role", "ROLE_CLERK")
                .issuedAt(Date.from(anHourAgo.minus(1, ChronoUnit.HOURS)))
                .expiration(Date.from(anHourAgo))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        mockMvc.perform(post(LOGOUT_URL).header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(NOT_LOGGED_IN_ERROR));
    }

    // ---------- Helpers ----------

    private User createUser(String roleName, boolean active) {
        Role role = roles.save(new Role(roleName));
        String email = "auth-test-" + UUID.randomUUID() + "@example.invalid";
        User user = new User("Test " + roleName, email, passwordService.hash(PASSWORD), role);
        user.setActive(active);
        return users.saveAndFlush(user);
    }

    private ResultActions login(String email, String password) throws Exception {
        String body = """
                {"email": "%s", "password": "%s"}
                """.formatted(email, password);
        return mockMvc.perform(post(LOGIN_URL).contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private String tokenFrom(ResultActions loginResult) throws Exception {
        String json = loginResult.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return json.replaceAll(".*\"token\":\"([^\"]+)\".*", "$1");
    }
}
