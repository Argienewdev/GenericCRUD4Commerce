package com.app.repository;

import com.app.model.SaleItem;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SaleItemRepository implements PanacheRepository<SaleItem> {

  public boolean isProductInAnySale(Long productId) {
    return count("product.id", productId) > 0;
  }
}
