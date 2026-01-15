package com.app;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoResource {

    @GET
    public List<Producto> listar() {
        return Producto.listAll();
    }

    @POST
    @Transactional
    public void crear(Producto producto) {
        producto.persist();
    }

    @DELETE
    @Path("/{id}") // Esto permite llamar a /productos/1, /productos/2, etc.
    @Transactional
    public void eliminar(@PathParam("id") Long id) {
        // Método mágico de Panache: borra por ID
        Producto.deleteById(id);
    }
}