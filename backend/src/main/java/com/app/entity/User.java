package com.app.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User extends PanacheEntityBase {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;

	@Column(unique = true, nullable = false)
	public String username;

	@Column(nullable = false)
	public String passwordHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	public Role role;

	@Column(nullable = false)
	public Boolean active = true;

	@Column(name = "created_at", nullable = false)
	public LocalDateTime createdAt;

	@Column(name = "updated_at")
	public LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public enum Role {
		ADMIN,
		VENDEDOR
	}

	// Método helper para validación de permisos (preparado para escalabilidad)
	public boolean hasPermission(String permission) {
		// Por ahora, mapeamos permisos simples a roles
		// Esto es fácilmente extensible a una tabla de permisos
		return switch (permission) {
			case "manage_users" -> role == Role.ADMIN;
			case "view_stock", "create_sale" -> role == Role.ADMIN || role == Role.VENDEDOR;
			case "manage_products" -> role == Role.ADMIN;
			default -> false;
		};
	}
}