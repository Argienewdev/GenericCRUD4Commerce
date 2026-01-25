package com.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sale_items")
public class SaleItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(updatable = false)
  public Long id;

  @ManyToOne
  @JoinColumn(name = "sale_id", nullable = false)
  @com.fasterxml.jackson.annotation.JsonIgnore
  public Sale sale;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  public Product product;

  @Column(nullable = false)
  public Integer quantity;

  @Column(nullable = false)
  public Double price; // Price at the time of sale
}
