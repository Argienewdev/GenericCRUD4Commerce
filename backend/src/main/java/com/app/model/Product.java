package com.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
		@Column(updatable = false)
    public Long id;

		@Column(nullable = false)
    public String name;

		@Column(nullable = false)
    public String description;

		@Column(nullable = false)
    public Double price;
		
    public int stock;
}