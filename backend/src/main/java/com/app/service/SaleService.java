package com.app.service;

import com.app.dto.SaleDTO;
import com.app.model.Product;
import com.app.model.Sale;
import com.app.model.SaleItem;
import com.app.model.User;
import com.app.repository.ClientRepository;
import com.app.repository.ProductRepository;
import com.app.repository.SaleItemRepository;
import com.app.repository.SaleRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class SaleService {

  private static final Logger LOG = Logger.getLogger(SaleService.class);

  @Inject
  SaleRepository saleRepository;

  @Inject
  SaleItemRepository saleItemRepository;

  @Inject
  ProductRepository productRepository;

  @Inject
  ClientRepository clientRepository;

  public List<Sale> getAllSales() {
    LOG.debug("Obteniendo todas las ventas");
    return saleRepository.listAll();
  }

  @Transactional
  public boolean deleteSale(Long id) {
    LOG.infof("Eliminando venta con ID: %d", id);
    // Nota: Ahora configurado con cascade en la entidad Sale,
    // borrando la venta se borran automáticamente sus items.
    // NO SE RESTAURA EL STOCK
    return saleRepository.deleteById(id);
  }

  @Transactional
  public Sale createSale(SaleDTO saleDTO, User seller) {
    LOG.info("Iniciando creación de venta");

    double total = 0;

    Sale sale = new Sale();
    sale.seller = seller;
    sale.date = LocalDateTime.now();
		sale.total = 0.0;
		saleRepository.persist(sale);

    for (SaleDTO.SaleItemEntry entry : saleDTO.items) {
      Product product = productRepository.findById(entry.productId);
      if (product == null) {
        LOG.errorf("Producto no encontrado con ID: %d", entry.productId);
        throw new IllegalArgumentException("Producto no encontrado: " + entry.productId);
      }

      if (product.stock < entry.quantity) {
        LOG.errorf("Stock insuficiente para producto: %s (ID: %d). Requested: %d, Available: %d",
            product.name, product.id, entry.quantity, product.stock);
        throw new IllegalStateException("Stock insuficiente para producto: " + product.name);
      }

      SaleItem saleItem = new SaleItem();
      saleItem.sale = sale;
      saleItem.product = product;
      saleItem.quantity = entry.quantity;
      saleItem.price = product.price;
      product.stock -= saleItem.quantity;
      saleItemRepository.persist(saleItem);

      total += product.price * entry.quantity;
    }
    sale.total = total;

    LOG.infof("Venta creada exitosamente - ID: %d, Total: %.2f", sale.id, sale.total);
    return sale;
  }
}
