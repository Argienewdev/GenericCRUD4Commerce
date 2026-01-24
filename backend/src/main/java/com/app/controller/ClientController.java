package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.model.Client;
import com.app.security.Secured;
import com.app.service.ClientService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@Path("/api/v1/clients")
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

@Secured
public class ClientController {

	private static final Logger LOG = Logger.getLogger(ClientController.class);

	@Inject
	ClientService clientService;

	@GET
	public Response listAll() {
		LOG.debug("GET /api/v1/clients - Listando todos los clientes");

		try {
			List<Client> clients = clientService.getAllClients();
			LOG.infof("Clientes recuperados exitosamente - Total: %d", clients.size());
			return Response.ok(clients).build();
		} catch (Exception e) {
			LOG.error("Error al listar clientes", e);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@POST
	public Response create(Client client) {
		LOG.infof("POST /api/v1/clients - DNI: %s, Nombre: %s",
				client.dni, client.name);
		
		try {
			Client createdClient = clientService.createClient(client);
			LOG.infof("Cliente creado exitosamente - ID: %d, DNI: %s",
					createdClient.id, createdClient.dni);

			return Response.status(Response.Status.CREATED)
					.entity(createdClient)
					.build();
		} catch (IllegalArgumentException e) {
			LOG.warnf("Error al crear cliente: %s", e.getMessage());
			return Response.status(Response.Status.CONFLICT)
					.entity(new ApiResponse(false, e.getMessage()))
					.build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al crear cliente con DNI: %s", client.dni);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@GET
	@Path("/dni/{dni}")
	public Response findByDni(@PathParam("dni") String dni) {
		LOG.debugf("GET /api/v1/clients/dni/%s", dni);

		try {
			Optional<Client> clientOpt = clientService.getClientByDni(dni);

			if (clientOpt.isEmpty()) {
				LOG.debugf("Cliente no encontrado con DNI: %s", dni);
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false, "Cliente no encontrado"))
						.build();
			}

			Client client = clientOpt.get();
			LOG.debugf("Cliente encontrado - ID: %d, DNI: %s", client.id, dni);
			return Response.ok(client).build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al buscar cliente por DNI: %s", dni);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@PUT
	@Path("/{id}")
	public Response update(@PathParam("id") Long id, Client newData) {
		LOG.infof("PUT /api/v1/clients/%d", id);

		try {
			Optional<Client> updatedClient = clientService.updateClient(id, newData);

			if (updatedClient.isEmpty()) {
				LOG.warnf("Intento de actualizar cliente inexistente - ID: %d", id);
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false,
								"Cliente no encontrado con id " + id))
						.build();
			}

			Client client = updatedClient.get();
			LOG.infof("Cliente actualizado exitosamente - ID: %d, DNI: %s",
					client.id, client.dni);

			return Response.ok(client).build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al actualizar cliente con ID: %d", id);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@DELETE
	@Path("/{id}")
	public Response delete(@PathParam("id") Long id) {
		LOG.infof("DELETE /api/v1/clients/%d", id);

		try {
			boolean deleted = clientService.deleteClient(id);

			if (!deleted) {
				LOG.warnf("Intento de eliminar cliente inexistente - ID: %d", id);
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false, "Cliente no encontrado"))
						.build();
			}

			LOG.infof("Cliente eliminado exitosamente - ID: %d", id);
			return Response.noContent().build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al eliminar cliente con ID: %d", id);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}
}