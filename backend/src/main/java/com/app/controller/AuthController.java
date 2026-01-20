package com.app.controller;

import com.app.dto.*;
import com.app.model.Session;
import com.app.model.User;
import com.app.service.AuthService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.jboss.logging.Logger;

import java.util.Optional;

@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

	private static final Logger LOG = Logger.getLogger(AuthController.class);

	@Inject
	AuthService authService;

	private static final String SESSION_COOKIE_NAME = "SESSION_ID";
	private static final int COOKIE_MAX_AGE = -1;

	@POST
	@Path("/login")
	public Response login(LoginRequest request, @Context HttpHeaders headers) {
		LOG.infof("POST /api/v1/auth/login - Usuario: %s", request.username());

		try {
			Optional<Session> sessionOpt = authService.login(request);

			if (sessionOpt.isEmpty()) {
				LOG.warnf("Login fallido para usuario: %s", request.username());
				return Response.status(Response.Status.UNAUTHORIZED)
						.entity(new LoginResponse(false, "Credenciales inválidas", null))
						.build();
			}

			Session session = sessionOpt.get();

			NewCookie sessionCookie = new NewCookie.Builder(SESSION_COOKIE_NAME)
					.value(session.getId().toString())
					.path("/") // Allows the cookie to be accesible from all domain's paths
					.maxAge(COOKIE_MAX_AGE) // Establishes a session cookie
					.httpOnly(true)
					.sameSite(NewCookie.SameSite.LAX)
					.secure(false) // TODO: update it to true when deployed
					.build();

			LoginResponse response = new LoginResponse(
					true,
					"Login exitoso",
					UserInfo.fromUser(session.getUser()));

			LOG.infof("Login exitoso. Usuario: %s, Session: %s",
					request.username(), session.getId());

			return Response.ok(response)
					.cookie(sessionCookie)
					.build();

		} catch (Exception e) {
			LOG.errorf(e, "Error inesperado en login para usuario: %s", request.username());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new LoginResponse(false, "Error interno del servidor", null))
					.build();
		}
	}

	@POST
	@Path("/logout")
	public Response logout(@CookieParam(SESSION_COOKIE_NAME) String sessionId) {
		LOG.infof("POST /api/v1/auth/logout - Session ID: %s", sessionId);

		boolean logoutSuccess = authService.logout(sessionId);

		NewCookie deleteCookie = new NewCookie.Builder(SESSION_COOKIE_NAME)
				.value("")
				.path("/")
				.maxAge(0)
				.httpOnly(true)
				.sameSite(NewCookie.SameSite.LAX)
				.secure(false) // TODO: update it to true when deployed
				.build();

		if (!logoutSuccess) {
			LOG.warnf("Intento de logout fallido - Session ID: %s", sessionId);
			return Response.status(Response.Status.BAD_REQUEST)
					.entity(new ApiResponse(false, "Sesión no encontrada o ya cerrada"))
					.cookie(deleteCookie)
					.build();
		}

		LOG.infof("Logout exitoso - Session ID: %s", sessionId);

		return Response.ok(new ApiResponse(true, "Logout exitoso"))
				.cookie(deleteCookie)
				.build();
	}

	@GET
	@Path("/me")
	public Response me(@CookieParam(SESSION_COOKIE_NAME) String sessionId) {
		LOG.debugf("GET /api/v1/auth/me - Session ID: %s", sessionId);

		Optional<User> userOpt = authService.validateSession(sessionId);

		if (userOpt.isEmpty()) {
			LOG.debugf("Sesión inválida en /me: %s", sessionId);
			return Response.status(Response.Status.UNAUTHORIZED)
					.entity(new ApiResponse(false, "Sesión inválida"))
					.build();
		}

		User user = userOpt.get();
		LOG.debugf("/me exitoso - Usuario: %s (ID: %d)", user.getUsername(), user.getId());

		return Response.ok(new MeResponse(UserInfo.fromUser(user)))
				.build();
	}
}