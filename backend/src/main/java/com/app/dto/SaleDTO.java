package com.app.dto;

import java.util.List;

public class SaleDTO {
  public Long clientId;
  public List<SaleItemEntry> items;

  public static class SaleItemEntry {
    public Long productId;
    public Integer quantity;
  }
}
