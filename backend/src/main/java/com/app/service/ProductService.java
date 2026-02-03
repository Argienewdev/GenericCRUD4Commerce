package com.app.service;

import com.app.model.Product;
import com.app.repository.ProductRepository;
import com.app.repository.SaleItemRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductService {

	private static final Logger LOG = Logger.getLogger(ProductService.class);

	@Inject
	ProductRepository productRepository;

	@Inject
	SaleItemRepository saleItemRepository;

	public List<Product> getAllProducts() {
		LOG.debug("Obteniendo lista de todos los productos");

		List<Product> products = productRepository.listAll();

		LOG.debugf("Total de productos encontrados: %d", products.size());

		return products;
	}

	@Transactional
	public Product createProduct(Product product) {
		LOG.debugf("Creando producto: %s, Precio: %.2f", product.name, product.price);

		productRepository.persist(product);

		LOG.debugf("Producto creado exitosamente - ID: %d, Nombre: %s",
				product.id, product.name);

		return product;
	}

	public Optional<Product> getProductById(Long id) {
		LOG.debugf("Buscando producto por ID: %d", id);

		Optional<Product> productOpt = productRepository.findByIdOptional(id);

		if (productOpt.isEmpty()) {
			LOG.debugf("Producto no encontrado con ID: %d", id);
		} else {
			LOG.debugf("Producto encontrado: %s (ID: %d)",
					productOpt.get().name, id);
		}

		return productOpt;
	}

	@Transactional
	public Optional<Product> updateProduct(Long id, Product newData) {
		LOG.debugf("Actualizando producto con ID: %d", id);

		Product entity = productRepository.findById(id);

		if (entity == null) {
			LOG.warnf("Intento de actualizar producto inexistente - ID: %d", id);
			return Optional.empty();
		}

		entity.name = newData.name;
		entity.description = newData.description;
		entity.price = newData.price;
		entity.stock = newData.stock;

		productRepository.persist(entity);

		LOG.debugf("Producto actualizado exitosamente - ID: %d, Nombre: %s",
				entity.id, entity.name);

		return Optional.of(entity);
	}

	@Transactional
	public boolean deleteProduct(Long id) {
		LOG.debugf("Eliminando producto con ID: %d", id);

		if (saleItemRepository.isProductInAnySale(id)) {
			LOG.warnf("No se puede eliminar el producto con ID: %d porque está asociado a una o más ventas", id);
			throw new WebApplicationException(
					Response.status(Response.Status.CONFLICT)
							.entity("No se puede eliminar el producto porque tiene ventas asociadas.")
							.build());
		}

		boolean deleted = productRepository.deleteById(id);

		if (!deleted) {
			LOG.warnf("Intento de eliminar producto inexistente - ID: %d", id);
			return false;
		}

		LOG.debugf("Producto eliminado exitosamente - ID: %d", id);

		return true;
	}
}