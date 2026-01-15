package com.app.uncategorized;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class ItemVenta extends PanacheEntity {
    
    @ManyToOne // Muchos items pueden pertenecer a UN producto
    public Producto producto;
    
    public int cantidad;
    public Double precioUnitario; // Precio congelado al momento de la venta
}