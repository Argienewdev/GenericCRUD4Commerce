package com.app.repository;

import com.app.model.Sale;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SaleRepository implements PanacheRepository<Sale> {
}
