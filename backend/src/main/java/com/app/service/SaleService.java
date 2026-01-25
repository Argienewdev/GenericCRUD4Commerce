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
import java.util.ArrayList;
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
    return saleRepository.deleteById(id);
  }

  @Transactional
  public Sale createSale(SaleDTO saleDTO, User seller) {
    LOG.info("Iniciando creación de venta");

    // 2. Validar stock de todos los productos primero (Atomicidad)
    List<SaleItemTemp> itemsToProcess = new ArrayList<>();
    double total = 0;

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

      itemsToProcess.add(new SaleItemTemp(product, entry.quantity));
      total += product.price * entry.quantity;
    }

    // 3. Crear cabecera de venta
    Sale sale = new Sale();
    sale.seller = seller;
    sale.date = LocalDateTime.now();
    sale.total = total;
    saleRepository.persist(sale);

    // 4. Crear items y decrementar stock
    for (SaleItemTemp itemTemp : itemsToProcess) {
      SaleItem saleItem = new SaleItem();
      saleItem.sale = sale;
      saleItem.product = itemTemp.product;
      saleItem.quantity = itemTemp.quantity;
      saleItem.price = itemTemp.product.price; // Guardamos precio actual
      saleItemRepository.persist(saleItem);

      // Decrementar stock
      itemTemp.product.stock -= itemTemp.quantity;
      productRepository.persist(itemTemp.product);
    }

    LOG.infof("Venta creada exitosamente - ID: %d, Total: %.2f", sale.id, sale.total);
    return sale;
  }

  private static class SaleItemTemp {
    Product product;
    int quantity;

    SaleItemTemp(Product product, int quantity) {
      this.product = product;
      this.quantity = quantity;
    }
  }
}
