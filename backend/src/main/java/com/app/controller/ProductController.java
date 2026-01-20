package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.model.Product;
import com.app.service.ProductService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@Path("/api/v1/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductController {

	private static final Logger LOG = Logger.getLogger(ProductController.class);

	@Inject
	ProductService productService;

	@GET
	public Response listAll() {
		LOG.debug("GET /api/v1/products - Listando todos los productos");

		try {
			List<Product> products = productService.getAllProducts();
			LOG.infof("Productos recuperados exitosamente - Total: %d", products.size());
			return Response.ok(products).build();
		} catch (Exception e) {
			LOG.error("Error al listar productos", e);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@POST
	public Response create(Product product) {
		LOG.infof("POST /api/v1/products - Nombre: %s, Precio: %.2f",
				product.name, product.price);

		try {
			Product createdProduct = productService.createProduct(product);
			LOG.infof("Producto creado exitosamente - ID: %d, Nombre: %s",
					createdProduct.id, createdProduct.name);

			return Response.status(Response.Status.CREATED)
					.entity(createdProduct)
					.build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al crear producto: %s", product.name);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@PUT
	@Path("/{id}")
	public Response update(@PathParam("id") Long id, Product newData) {
		LOG.infof("PUT /api/v1/products/%d", id);

		try {
			Optional<Product> updatedProduct = productService.updateProduct(id, newData);

			if (updatedProduct.isEmpty()) {
				LOG.warnf("Intento de actualizar producto inexistente - ID: %d", id);
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false,
								"Producto no encontrado con id " + id))
						.build();
			}

			Product product = updatedProduct.get();
			LOG.infof("Producto actualizado exitosamente - ID: %d, Nombre: %s",
					product.id, product.name);

			return Response.ok(product).build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al actualizar producto con ID: %d", id);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}

	@DELETE
	@Path("/{id}")
	public Response delete(@PathParam("id") Long id) {
		LOG.infof("DELETE /api/v1/products/%d", id);

		try {
			boolean deleted = productService.deleteProduct(id);

			if (!deleted) {
				LOG.warnf("Intento de eliminar producto inexistente - ID: %d", id);
				return Response.status(Response.Status.NOT_FOUND)
						.entity(new ApiResponse(false, "Producto no encontrado"))
						.build();
			}

			LOG.infof("Producto eliminado exitosamente - ID: %d", id);
			return Response.noContent().build();
		} catch (Exception e) {
			LOG.errorf(e, "Error al eliminar producto con ID: %d", id);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(new ApiResponse(false, "Error interno del servidor"))
					.build();
		}
	}
}