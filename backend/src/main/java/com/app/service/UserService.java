package com.app.service;

import com.app.dto.CreateUserRequest;
import com.app.model.User;
import com.app.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;
import org.mindrot.jbcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserService {

	private static final Logger LOG = Logger.getLogger(UserService.class);

	@Inject
	UserRepository userRepository;

	@Transactional
	public User createUser(CreateUserRequest request) {
		LOG.debugf("Creando usuario: %s con rol: %s", request.username(), request.role());

		// Validar que no exista un usuario con el mismo username
		Optional<User> existingUser = userRepository.findByUsername(request.username());
		if (existingUser.isPresent()) {
			LOG.warnf("Intento de crear usuario duplicado: %s", request.username());
			throw new IllegalArgumentException("Ya existe un usuario con el username: " + request.username());
		}

		// Crear y persistir usuario
		User user = new User();
		user.setUsername(request.username());
		user.setPasswordHash(BCrypt.hashpw(request.password(), BCrypt.gensalt()));
		user.setRole(request.role());

		userRepository.persist(user);

		LOG.debugf("Usuario creado exitosamente: %s (ID: %d)", user.getUsername(), user.getId());

		return user;
	}

	public List<User> getAllUsers() {
		LOG.debug("Obteniendo lista de todos los usuarios");

		List<User> users = userRepository.listAll();

		LOG.debugf("Total de usuarios encontrados: %d", users.size());

		return users;
	}

	public Optional<User> getUserById(Long id) {
		LOG.debugf("Buscando usuario por ID: %d", id);

		Optional<User> userOpt = userRepository.findByIdOptional(id);

		if (userOpt.isEmpty()) {
			LOG.debugf("Usuario no encontrado con ID: %d", id);
		} else {
			LOG.debugf("Usuario encontrado: %s (ID: %d)",
					userOpt.get().getUsername(), id);
		}

		return userOpt;
	}

	@Transactional
	public boolean deactivateUser(Long id) {
		LOG.debugf("Desactivando usuario con ID: %d", id);

		Optional<User> userOpt = userRepository.findByIdOptional(id);

		if (userOpt.isEmpty()) {
			LOG.warnf("Intento de desactivar usuario inexistente - ID: %d", id);
			return false;
		}

		User user = userOpt.get();

		if (!user.isActive()) {
			LOG.warnf("Usuario ya estaba desactivado: %s (ID: %d)",
					user.getUsername(), id);
			return false;
		}

		user.setActive(false);
		userRepository.persist(user);

		LOG.debugf("Usuario desactivado exitosamente: %s (ID: %d)",
				user.getUsername(), id);

		return true;
	}

	@Transactional
	public boolean activateUser(Long id) {
		LOG.debugf("Activando usuario con ID: %d", id);

		Optional<User> userOpt = userRepository.findByIdOptional(id);

		if (userOpt.isEmpty()) {
			LOG.warnf("Intento de activar usuario inexistente - ID: %d", id);
			return false;
		}

		User user = userOpt.get();

		if (user.isActive()) {
			LOG.warnf("Usuario ya estaba activo: %s (ID: %d)",
					user.getUsername(), id);
			return false;
		}

		user.setActive(true);
		userRepository.persist(user);

		LOG.debugf("Usuario activado exitosamente: %s (ID: %d)",
				user.getUsername(), id);

		return true;
	}

	@Transactional
	public Optional<User> updateUserRole(Long id, User.Role newRole) {
		LOG.debugf("Actualizando rol de usuario ID: %d a rol: %s", id, newRole);

		Optional<User> userOpt = userRepository.findByIdOptional(id);

		if (userOpt.isEmpty()) {
			LOG.warnf("Intento de actualizar rol de usuario inexistente - ID: %d", id);
			return Optional.empty();
		}

		User user = userOpt.get();
		User.Role oldRole = user.getRole();
		user.setRole(newRole);
		userRepository.persist(user);

		LOG.debugf("Rol de usuario actualizado exitosamente: %s (ID: %d) - %s -> %s",
				user.getUsername(), id, oldRole, newRole);

		return Optional.of(user);
	}

	@Transactional
	public Optional<User> updateUser(Long id, CreateUserRequest request) {
		LOG.debugf("Actualizando usuario ID: %d - Username: %s, Role: %s",
				id, request.username(), request.role());

		Optional<User> userOpt = userRepository.findByIdOptional(id);

		if (userOpt.isEmpty()) {
			LOG.warnf("Intento de actualizar usuario inexistente - ID: %d", id);
			return Optional.empty();
		}

		User user = userOpt.get();

		// Validar username si es diferente al actual
		if (!user.getUsername().equals(request.username())) {
			Optional<User> existingUser = userRepository.findByUsername(request.username());
			if (existingUser.isPresent()) {
				throw new IllegalArgumentException("Ya existe un usuario con el username: " + request.username());
			}
			user.setUsername(request.username());
		}

		// Actualizar password solo si no es nulo o vacío
		if (request.password() != null && !request.password().trim().isEmpty()) {
			user.setPasswordHash(BCrypt.hashpw(request.password(), BCrypt.gensalt()));
		}

		user.setRole(request.role());
		userRepository.persist(user);

		LOG.debugf("Usuario actualizado exitosamente: %s (ID: %d)",
				user.getUsername(), id);

		return Optional.of(user);
	}
}