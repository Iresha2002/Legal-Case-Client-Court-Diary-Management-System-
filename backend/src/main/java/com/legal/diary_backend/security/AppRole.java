package com.legal.diary_backend.security;

import java.util.Arrays;
import java.util.Optional;

/**
 * The only roles that may log in. Each one links a role name in the roles table
 * to the authority Spring Security uses (for example ROLE_SENIOR_LAWYER).
 * The Administrator View is a view of the Senior Lawyer account, not a role.
 */
public enum AppRole {
    SENIOR_LAWYER("Senior Lawyer"),
    JUNIOR_LAWYER("Junior Lawyer"),
    CLERK("Clerk");

    private final String roleName;

    AppRole(String roleName) {
        this.roleName = roleName;
    }

    public String authority() {
        return "ROLE_" + name();
    }

    /** Finds the matching role, or empty if the name is not one of the three allowed roles. */
    public static Optional<AppRole> fromRoleName(String roleName) {
        return Arrays.stream(values())
                .filter(role -> role.roleName.equals(roleName))
                .findFirst();
    }
}
