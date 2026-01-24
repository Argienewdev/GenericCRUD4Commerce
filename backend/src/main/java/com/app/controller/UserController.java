package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.CreateUserRequest;
import com.app.dto.UserInfo;
import com.app.model.User;
import com.app.security.Secured;
import com.app.service.UserService;
import jakarta.inject.Inject;
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

/*
 * All methods in this class require authentication (@Secured at class level).
 * 
 * This ensures:
 * 
 * - Every request has a valid session
 * - SecurityContext.getCurrentUser() is always available and never null
 * - Session validation happens once per request in the filter (no manual checks
 * needed)
 * 
 * Individual methods can override with @Secured(roles = {...}) to add
 * role-based authorization.
 */

@Secured(roles = { User.Role.ADMIN })
public class UserController {

	private static final Logger LOG = Logger.getLogger(UserController.class);

	@Inject
	UserService userService;

	@POST
	public Response createUser(CreateUserRequest request) {
		LOG.infof("POST /api/v1/users - Creando usuario: %s con rol: %s",
				request.username(), request.role());

		try {
			User user = userService.createUser(request);

			LOG.infof("Usuario creado exitosamente: %s (ID: %d)",
					user.getUsername(), user.getId());

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
	public Response listUsers() {
		LOG.debug("GET /api/v1/users - Listando usuarios");

		try {
			List<User> users = userService.getAllUsers();

			List<UserInfo> userInfoList = users.stream()
					.map(UserInfo::fromUser)
					.collect(Collectors.toList());

			LOG.infof("Usuarios recuperados exitosamente - Total: %d", userInfoList.size());

			return Response.ok(userInfoList).build();

		} catch (Exception e) {
			LOG.error("Error al listar usuarios", e);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@DELETE
	@Path("/{id}")
	public Response deleteUser(@PathParam("id") Long id) {
		LOG.infof("DELETE /api/v1/users/%d - Desactivando usuario", id);

		try {
			boolean deactivated = userService.deactivateUser(id);

			if (!deactivated) {
				LOG.warnf("Usuario no encontrado o ya desactivado - ID: %d", id);
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false, "Usuario no encontrado o ya desactivado"))
						.build();
			}

			LOG.infof("Usuario desactivado exitosamente - ID: %d", id);

			return Response.ok(new ApiResponse(true, "Usuario desactivado"))
					.build();

		} catch (Exception e) {
			LOG.errorf(e, "Error al desactivar usuario con ID: %d", id);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@PUT
	@Path("/{id}")
	public Response updateUser(@PathParam("id") Long id, CreateUserRequest request) {
		LOG.infof("PUT /api/v1/users/%d - Actualizando usuario: %s con rol: %s",
				id, request.username(), request.role());

		try {
			Optional<User> updatedUser = userService.updateUser(id, request);

			if (updatedUser.isEmpty()) {
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false, "Usuario no encontrado"))
						.build();
			}

			LOG.infof("Usuario actualizado exitosamente: %s (ID: %d)",
					updatedUser.get().getUsername(), id);

			return Response.ok(new ApiResponse(true, "Usuario actualizado exitosamente"))
					.build();

		} catch (IllegalArgumentException e) {
			LOG.warnf("Error al actualizar usuario: %s", e.getMessage());
			return Response.status(Response.Status.BAD_REQUEST)
					.entity(new ApiResponse(false, e.getMessage()))
					.build();

		} catch (Exception e) {
			LOG.errorf(e, "Error inesperado al actualizar usuario: %s", request.username());
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}
}