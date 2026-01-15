package com.app;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Venta extends PanacheEntity {
    
    public LocalDateTime fecha;
    public Double total;

    // Una Venta tiene MUCHOS items
    // CascadeType.ALL significa: Si guardo la Venta, guarda sus items automáticamente
    @OneToMany(cascade = CascadeType.ALL) 
    public List<ItemVenta> items = new ArrayList<>();
}