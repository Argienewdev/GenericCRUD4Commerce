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
		LOG.infof("Intento de login para usuario: %s", loginRequest.username());

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

		LOG.infof("Login exitoso para usuario: %s (ID: %d, Role: %s). Session ID: %s",
				loginRequest.username(), user.getId(), user.getRole(), session.getId());

		return Optional.of(session);
	}

	@Transactional
	public boolean logout(String sessionId) {
		LOG.infof("Intento de logout. Session ID: %s", sessionId);

		if (sessionId == null || sessionId.isBlank()) {
			return false;
		}

		try {
			UUID id = UUID.fromString(sessionId);
			Optional<Session> sessionOpt = sessionRepository.findByIdOptional(id);

			if (sessionOpt.isEmpty()) {
				LOG.warnf("Sesión no encontrada para logout: %s", sessionId);
				return false;
			}

			sessionRepository.delete(sessionOpt.get());
			LOG.infof("Logout exitoso. Session ID: %s", sessionId);
			return true;
		} catch (IllegalArgumentException e) {
			LOG.warnf("Session ID inválido para logout: %s", sessionId);
			return false;
		}
	}

	@Transactional
	public Optional<User> validateSession(String sessionId) {
		if (sessionId == null || sessionId.isBlank()) {
			LOG.debug("Session ID vacío en validateSession");
			return Optional.empty();
		}

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
	}

	@Transactional
	public void cleanExpiredSessions() {
		LOG.debug("Limpiando sesiones expiradas...");
		sessionRepository.deleteExpiredSessions();
		LOG.debug("Limpieza de sesiones completada");
	}
}
