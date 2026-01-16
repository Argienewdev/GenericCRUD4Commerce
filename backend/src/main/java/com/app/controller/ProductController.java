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

    // Endpoint: GET /products
    @GET
    public List<Product> listAll() {
        return repository.listAll();
    }

    // Endpoint: POST /products
    @POST
    @Transactional
    public Response create(Product product) {
        repository.persist(product);
        
        // 201 (Created)
        return Response.status(Response.Status.CREATED).entity(product).build();
    }
}