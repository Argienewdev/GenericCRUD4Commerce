package com.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
public class Sale {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(updatable = false)
  public Long id;

  @ManyToOne
  @JoinColumn(name = "seller_id", nullable = false)
  public User seller;

  @Column(nullable = false)
  public LocalDateTime date;

  @Column(nullable = false)
  public Double total;

  @jakarta.persistence.OneToMany(mappedBy = "sale", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
  public java.util.List<SaleItem> items;
}
