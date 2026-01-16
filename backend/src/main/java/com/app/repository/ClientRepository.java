package com.app.repository;

import com.app.model.Client;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ClientRepository implements PanacheRepository<Client> {
    public Client findByDni(Integer dni) {
        return find("dni", dni).firstResult();
    }
}