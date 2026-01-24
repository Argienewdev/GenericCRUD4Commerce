package com.app.security;

import com.app.model.User;
import com.app.service.AuthService;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.interceptor.AroundInvoke;
import jakarta.interceptor.Interceptor;
import jakarta.interceptor.InvocationContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Cookie;
import jakarta.ws.rs.core.HttpHeaders;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@Secured
@Interceptor
@Priority(Interceptor.Priority.APPLICATION)
public class SecuredInterceptor {

    @Inject
    AuthService authService;

    @Context
    HttpHeaders headers;

    @AroundInvoke
    public Object validateSecurity(InvocationContext context) throws Exception {
        Secured secured = context.getMethod().getAnnotation(Secured.class);
        
        if (secured == null) {
            secured = context.getTarget().getClass().getAnnotation(Secured.class);
        }

        if (secured == null) {
            return context.proceed();
        }

        Map<String, Cookie> cookies = headers.getCookies();
        Cookie sessionCookie = cookies.get("SESSION_ID");

        if (sessionCookie == null) {
            throw new jakarta.ws.rs.NotAuthorizedException("Sesión no encontrada");
        }

        Optional<User> userOpt = authService.validateSession(sessionCookie.getValue());
        
        if (userOpt.isEmpty()) {
            throw new jakarta.ws.rs.NotAuthorizedException("Sesión inválida");
        }

        User user = userOpt.get();

        User.Role[] requiredRoles = secured.roles();
        if (requiredRoles.length > 0) {
            boolean hasRole = Arrays.asList(requiredRoles).contains(user.getRole());
            if (!hasRole) {
                throw new jakarta.ws.rs.ForbiddenException("No tienes permisos para esta acción");
            }
        }

        return context.proceed();
    }
}