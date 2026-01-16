package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.CreateUserRequest;
import com.app.dto.UserInfo;
import com.app.model.User;
import com.app.repository.UserRepository;
import com.app.security.Secured;
import com.app.service.AuthService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/api/v1/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

	private static final Logger LOG = Logger.getLogger(UserResource.class);

	@Inject
	AuthService authService;

	@Inject
	UserRepository userRepository;

	@POST
	@Secured(roles = { User.Role.ADMIN })
	@Transactional
	public Response createUser(CreateUserRequest request) {
		LOG.infof("POST /api/v1/users - Creando usuario: %s con rol: %s",
				request.username(), request.role());

		try {
			User user = authService.createUser(request);

			LOG.infof("Usuario creado exitosamente: %s (ID: %d)", user.getUsername(), user.getId());

			return Response.status(Response.Status.CREATED)
					.entity(new ApiResponse(true, "Usuario creado exitosamente"))
					.build();

		} catch (IllegalArgumentException e) {
			LOG.warnf("Error al crear usuario: %s", e.getMessage());
			return Response.status(Response.Status.BAD_REQUEST)
					.entity(new ApiResponse(false, e.getMessage()))
					.build();

		} catch (Exception e) {
			LOG.errorf(e, "Error inesperado al crear usuario: %s", request.username());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@GET
	@Secured(roles = { User.Role.ADMIN })
	public Response listUsers() {
		LOG.debug("GET /api/v1/users - Listando usuarios");

		List<UserInfo> users = userRepository.listAll()
				.stream()
				.map(UserInfo::fromUser)
				.collect(Collectors.toList());

		LOG.debugf("Usuarios encontrados: %d", users.size());

		return Response.ok(users).build();
	}

	@DELETE
	@Path("/{id}")
	@Secured(roles = { User.Role.ADMIN })
	@Transactional
	public Response deleteUser(@PathParam("id") Long id) {
		LOG.infof("DELETE /api/v1/users/%d - Desactivando usuario", id);

		Optional<User> userOpt = userRepository.findByIdOptional(id);

		if (userOpt.isEmpty()) {
			LOG.warnf("Usuario no encontrado para desactivar: ID %d", id);
			return Response.status(Response.Status.NOT_FOUND)
					.entity(new ApiResponse(false, "Usuario no encontrado"))
					.build();
		}

		User user = userOpt.get();
		user.setActive(false);
		userRepository.persist(user);

		LOG.infof("Usuario desactivado exitosamente: %s (ID: %d)", user.getUsername(), id);

		return Response.ok(new ApiResponse(true, "Usuario desactivado"))
				.build();
	}
}