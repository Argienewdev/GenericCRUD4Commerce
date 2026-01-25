package com.app.repository;

import com.app.model.SaleItem;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SaleItemRepository implements PanacheRepository<SaleItem> {
}
