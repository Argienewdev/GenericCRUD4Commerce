package com.app.controller;

import com.app.model.Client;
import com.app.repository.ClientRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("api/v1/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientController {

    @Inject
    ClientRepository repository;

    // Endpoint: GET /clients
    @GET
    public List<Client> listAll() {
        return repository.listAll();
    }

    // Endpoint: POST /clients
    @POST
    @Transactional
    public Response create(Client client) {
        Client exists = repository.find("dni", client.dni).firstResult();

        if (exists != null) {
            // error 409 (Conflict)
            return Response.status(Response.Status.CONFLICT)
                    .entity(java.util.Map.of("error", "Ya existe un cliente registrado con el DNI " + client.dni))
                    .build();
        }

        repository.persist(client);
        return Response.status(Response.Status.CREATED).entity(client).build();
    }
    
    // Endpoint: GET /clients/dni/{dni}
    @GET
    @Path("/dni/{dni}")
    public Response findByDni(@PathParam("dni") Integer dni) {
        Client found = repository.find("dni", dni).firstResult();
        
        if (found == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        return Response.ok(found).build();
    }
}