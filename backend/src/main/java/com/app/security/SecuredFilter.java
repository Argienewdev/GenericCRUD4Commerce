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

@Provider
@Priority(Priorities.AUTHENTICATION)
public class SecuredFilter implements ContainerRequestFilter {

	private static final Logger LOG = Logger.getLogger(SecuredFilter.class);

	@Inject
	AuthService authService;

	@Context
	ResourceInfo resourceInfo;

	@Override
	public void filter(ContainerRequestContext requestContext) {
		Method method = resourceInfo.getResourceMethod();
		Class<?> resourceClass = resourceInfo.getResourceClass();

		if (method == null) {
			return;
		}

		Secured secured = method.getAnnotation(Secured.class);
		if (secured == null) {
			secured = resourceClass.getAnnotation(Secured.class);
		}

		if (secured == null) {
			return;
		}

		LOG.debugf("Validando seguridad para endpoint: %s.%s", 
				resourceClass.getSimpleName(), method.getName());

		Map<String, Cookie> cookies = requestContext.getCookies();
		Cookie sessionCookie = cookies.get("SESSION_ID");

		if (sessionCookie == null) {
			LOG.warn("Intento de acceso sin cookie de sesión");
			throw new jakarta.ws.rs.NotAuthorizedException("Sesión no encontrada");
		}

		Optional<User> userOpt = authService.validateSession(sessionCookie.getValue());

		if (userOpt.isEmpty()) {
			LOG.warnf("Intento de acceso con sesión inválida: %s", sessionCookie.getValue());
			throw new jakarta.ws.rs.NotAuthorizedException("Sesión inválida");
		}

		User user = userOpt.get();
		User.Role[] requiredRoles = secured.roles();

		if (requiredRoles.length > 0) {
			boolean hasRole = Arrays.asList(requiredRoles).contains(user.getRole());
			
			if (!hasRole) {
				LOG.warnf("Acceso denegado - Usuario: %s (Rol: %s) intentó acceder a endpoint que requiere: %s",
						user.getUsername(), user.getRole(), Arrays.toString(requiredRoles));
				throw new jakarta.ws.rs.ForbiddenException("No tienes permisos para esta acción");
			}

			LOG.debugf("Acceso permitido - Usuario: %s (Rol: %s) para endpoint: %s",
					user.getUsername(), user.getRole(), method.getName());
		}

		requestContext.setProperty("currentUser", user);
	}
}