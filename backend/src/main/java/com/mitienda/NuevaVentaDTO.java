package com.mitienda;
import java.util.List;

public class NuevaVentaDTO {
    public List<ItemDTO> items;

    public static class ItemDTO {
        public Long productoId;
        public int cantidad;
    }
}