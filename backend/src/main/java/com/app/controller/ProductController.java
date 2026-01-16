package com.app.controller;

import com.app.model.Product;
import com.app.repository.ProductRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("api/v1/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductController {

    @Inject
    ProductRepository repository;

    // Endpoint: GET api/v1/products
    @GET
    public List<Product> listAll() {
        return repository.listAll();
    }

    // Endpoint: POST api/v1/products
    @POST
    @Transactional
    public Response create(Product product) {
        repository.persist(product);
        
        // 201 (Created)
        return Response.status(Response.Status.CREATED).entity(product).build();
    }

    // Endpoint: PUT api/v1/products/{id}
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Product datosNuevos) {

      Product entity = repository.findById(id);

      // error 404
      if (entity == null) {
          return Response.status(Response.Status.NOT_FOUND).build();
      }

      entity.name = datosNuevos.name;
      entity.description = datosNuevos.description; 
      entity.price = datosNuevos.price;
      entity.stock = datosNuevos.stock;
      
      return Response.ok(entity).build();
    }

    // Endpoint: DELETE api/v1/products/{id}
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        
        boolean eliminado = repository.deleteById(id);

        if (!eliminado) {
            return Response.status(Response.Status.NOT_FOUND).build(); // 404
        }

        return Response.noContent().build(); // 204 
    }
}