package com.app.repository;

import com.app.model.Client;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class ClientRepository implements PanacheRepository<Client> {

	public Optional<Client> findByDni(int dni) {
		return find("dni", dni).firstResultOptional();
	}

	public boolean existsByDni(int dni) {
		return count("dni", dni) > 0;
	}
}