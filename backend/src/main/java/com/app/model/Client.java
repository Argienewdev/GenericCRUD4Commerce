package com.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "clients")
public class Client {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(updatable = false)
  public Long id;

  @Column(nullable = false)
  public String name;

  @Column(nullable = false)
  public String surname;

  @Column(nullable = false)
  public String address;

  @Column(unique = true, nullable = false)
  public String dni;

  @Column(name = "phone_number", nullable =  false)
  public String phoneNumber;
}