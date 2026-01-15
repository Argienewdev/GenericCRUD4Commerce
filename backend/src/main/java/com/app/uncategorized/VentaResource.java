package com.app.uncategorized;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.time.LocalDateTime;
import java.util.List;

import io.quarkus.panache.common.Sort;

@Path("/ventas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VentaResource {

    @POST
    @Transactional // ¡VITAL! O se hace todo, o no se hace nada (si falla algo, revierte el stock)
    public void realizarVenta(NuevaVentaDTO dto) {
        Venta venta = new Venta();
        venta.fecha = LocalDateTime.now();
        venta.total = 0.0;

        for (NuevaVentaDTO.ItemDTO itemDTO : dto.items) {
            // 1. Buscamos el producto
            Producto producto = Producto.findById(itemDTO.productoId);
            if (producto == null) {
                throw new WebApplicationException("Producto no encontrado: " + itemDTO.productoId, 404);
            }

            // 2. Validamos Stock
            if (producto.stock < itemDTO.cantidad) {
                throw new WebApplicationException("Stock insuficiente para: " + producto.nombre, 400);
            }

            // 3. Restamos Stock
            producto.stock -= itemDTO.cantidad;

            // 4. Creamos la línea del ticket
            ItemVenta item = new ItemVenta();
            item.producto = producto;
            item.cantidad = itemDTO.cantidad;
            item.precioUnitario = producto.precio; // Congelamos el precio

            // 5. Agregamos a la venta y sumamos al total
            venta.items.add(item);
            venta.total += (producto.precio * itemDTO.cantidad);
        }

        // 6. Guardamos la venta (Hibernate guarda los items automáticamente por el Cascade)
        venta.persist();
    }

    // Importa estas clases arriba si te faltan:
    // import io.quarkus.panache.common.Sort;
    // import java.util.List;

    @GET
    public List<Venta> listarVentas() {
        // Devuelve todas las ventas, ordenadas desde la más reciente
        return Venta.listAll(Sort.descending("fecha"));
    }
}