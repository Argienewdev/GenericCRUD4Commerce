package com.app.repository;

import com.app.model.User;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheRepository<User> {

	public Optional<User> findByUsername(String username) {
		return find("username = ?1 and active = true", username).firstResultOptional();
	}

	public Optional<User> findActiveById(Long id) {
		return find("id = ?1 and active = true", id).firstResultOptional();
	}

	public boolean existsByUsername(String username) {
		return count("username = ?1", username) > 0;
	}
}