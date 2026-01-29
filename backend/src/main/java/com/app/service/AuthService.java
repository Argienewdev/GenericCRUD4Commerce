package com.app.service;

import com.app.dto.LoginRequest;
import com.app.model.Session;
import com.app.model.User;
import com.app.repository.SessionRepository;
import com.app.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class AuthService {

	private static final Logger LOG = Logger.getLogger(AuthService.class);

	@Inject
	UserRepository userRepository;

	@Inject
	SessionRepository sessionRepository;

	@Inject
	PasswordService passwordService;

	@Transactional
	public Optional<Session> login(LoginRequest loginRequest) {
		LOG.debugf("Intento de login para usuario: %s", loginRequest.username());

		Optional<User> userOpt = userRepository.findByUsername(loginRequest.username());

		if (userOpt.isEmpty()) {
			LOG.warnf("Usuario no encontrado: %s", loginRequest.username());
			return Optional.empty();
		}

		User user = userOpt.get();

		if (!passwordService.verifyPassword(loginRequest.password(), user.getPasswordHash())) {
			LOG.warnf("Contraseña incorrecta para usuario: %s", loginRequest.username());
			return Optional.empty();
		}

		Session session = new Session();
		session.setUser(user);
		sessionRepository.persist(session);

		LOG.debugf("Login exitoso para usuario: %s (ID: %d, Role: %s). Session ID: %s",
				loginRequest.username(), user.getId(), user.getRole(), session.getId());

		return Optional.of(session);
	}

	@Transactional
	public boolean logout(String sessionIdString) {
		LOG.debugf("Intento de logout. Session ID: %s", sessionIdString);

		try {
			UUID sessionId = UUID.fromString(sessionIdString);
			Optional<Session> sessionOpt = sessionRepository.findByIdOptional(sessionId);

			if (sessionOpt.isEmpty()) {
				LOG.warnf("Sesión no encontrada para logout: %s", sessionId);
				return false;
			}

			sessionRepository.delete(sessionOpt.get());
			LOG.debugf("Logout exitoso. Session ID: %s", sessionId);

			return true;

		} catch (IllegalArgumentException e) {
			LOG.warnf("Session ID inválido en logout: %s", sessionIdString);
			return false;
		}
	}

	public Optional<User> validateSession(String sessionIdString) {
		if (sessionIdString == null || sessionIdString.isBlank()) {
			LOG.debug("Session ID vacío en validateSession");
			return Optional.empty();
		}

		try {
			UUID sessionId = UUID.fromString(sessionIdString);
			LOG.debugf("Validando sesión: %s", sessionId);

			Optional<Session> sessionOpt = sessionRepository.findValidSession(sessionId);

			if (sessionOpt.isEmpty()) {
				LOG.debugf("Sesión inválida o expirada: %s", sessionId);
				return Optional.empty();
			}

			Session session = sessionOpt.get();
			User user = session.getUser();

			if (!user.isActive()) {
				LOG.warnf("Usuario inactivo intenta usar sesión válida. User ID: %d", user.getId());
				return Optional.empty();
			}

			session.updateActivity();
			sessionRepository.persist(session);

			LOG.debugf("Sesión válida para usuario: %s (ID: %d, Role: %s)",
					user.getUsername(), user.getId(), user.getRole());

			return Optional.of(user);

		} catch (IllegalArgumentException e) {
			LOG.warnf("Session ID inválido en validateSession: %s", sessionIdString);
			return Optional.empty();
		}
	}

	@Transactional
	public void cleanExpiredSessions() {
		LOG.debug("Limpiando sesiones expiradas...");
		sessionRepository.deleteExpiredSessions();
		LOG.debug("Limpieza de sesiones completada");
	}
}