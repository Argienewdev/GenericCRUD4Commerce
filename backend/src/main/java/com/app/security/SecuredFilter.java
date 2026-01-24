package com.app.security;

import com.app.model.User;
import com.app.service.AuthService;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.ext.Provider;
import org.jboss.logging.Logger;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

/**
 * JAX-RS filter that intercepts all HTTP requests to enforce security based
 * on @Secured annotation.
 * This filter runs during the AUTHENTICATION phase, before the actual endpoint
 * method is executed (i.e before reaching the controller).
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class SecuredFilter implements ContainerRequestFilter {

	private static final Logger LOG = Logger.getLogger(SecuredFilter.class);

	@Inject
	AuthService authService;

	/**
	 * ResourceInfo provides metadata about the endpoint being invoked:
	 * - getResourceMethod(): the actual method (e.g., listUsers())
	 * - getResourceClass(): the controller class (e.g., UserController.class)
	 */
	@Context
	ResourceInfo resourceInfo;

	/**
	 * Main filter method that executes for EVERY incoming HTTP request.
	 * This is where we check if the endpoint requires authentication/authorization.
	 */
	@Override
	public void filter(ContainerRequestContext requestContext) {
		// Step 1: Get information about the endpoint being called
		Method method = resourceInfo.getResourceMethod();
		Class<?> resourceClass = resourceInfo.getResourceClass();

		// Edge case: if method info is unavailable, allow the request to proceed
		if (method == null) {
			return;
		}

		// Step 2: Check if the endpoint has @Secured annotation
		// First check the method level (e.g., @GET @Secured)
		Secured secured = method.getAnnotation(Secured.class);

		// If not found on method, check the class level (e.g., @Path @Secured on
		// controller)
		if (secured == null) {
			secured = resourceClass.getAnnotation(Secured.class);
		}

		// Step 3: If no @Secured annotation is present, this endpoint is public
		// Allow the request to proceed without authentication/authorization checks
		if (secured == null) {
			return;
		}

		// From this point on, we know the endpoint requires security checks
		LOG.debugf("Validating security for endpoint: %s.%s",
				resourceClass.getSimpleName(), method.getName());

		// Step 4: Extract cookies from the HTTP request
		Map<String, Cookie> cookies = requestContext.getCookies();
		Cookie sessionCookie = cookies.get("SESSION_ID");

		// Step 5: Check if the session cookie exists
		if (sessionCookie == null) {
			LOG.warnf("Access attempt without session cookie to endpoint: %s", method.getName());
			// Throw 401 Unauthorized - client needs to login first
			throw new jakarta.ws.rs.NotAuthorizedException("Session not found");
		}

		// Step 6: Validate the session using AuthService
		// sessionCookie.getValue() returns the UUID string from the cookie
		Optional<User> userOpt = authService.validateSession(sessionCookie.getValue());

		// Step 7: Check if the session is valid (exists and not expired)
		if (userOpt.isEmpty()) {
			LOG.warnf("Access attempt with invalid session: %s to endpoint: %s",
					sessionCookie.getValue(), method.getName());
			// Throw 401 Unauthorized - session is invalid or expired
			throw new jakarta.ws.rs.NotAuthorizedException("Invalid session");
		}

		// Step 8: Extract the authenticated user from the valid session
		User user = userOpt.get();

		// Step 9: Get the required roles from the @Secured annotation
		// Example: @Secured(roles = {User.Role.ADMIN}) → requiredRoles = [ADMIN]
		User.Role[] requiredRoles = secured.roles();

		// Step 10: Check if role-based authorization is required
		if (requiredRoles.length > 0) {
			// Check if the user's role is in the list of required roles
			boolean hasRole = Arrays.asList(requiredRoles).contains(user.getRole());

			if (!hasRole) {
				// User is authenticated but doesn't have the required role
				LOG.warnf("Access denied - User: %s (Role: %s) attempted to access endpoint requiring: %s",
						user.getUsername(), user.getRole(), Arrays.toString(requiredRoles));
				// Throw 403 Forbidden - authenticated but not authorized
				throw new jakarta.ws.rs.ForbiddenException("You don't have permission for this action");
			}

			LOG.debugf("Access granted - User: %s (Role: %s) for endpoint: %s",
					user.getUsername(), user.getRole(), method.getName());
		}

		// Step 11: Store the authenticated user in the request context
		// This allows downstream code (controllers, services) to access the current
		// user
		// without re-validating the session
		requestContext.setProperty("currentUser", user);

		// Step 12: Allow the request to proceed to the actual endpoint method
		// The filter chain continues and eventually calls your controller method
	}
}