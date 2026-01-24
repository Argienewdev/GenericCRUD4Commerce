package com.app.security;

import com.app.model.User;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;

@RequestScoped
public class SecurityContext {

	@Context
	ContainerRequestContext requestContext;

	public User getCurrentUser() {
		return (User) requestContext.getProperty("currentUser");
	}
}