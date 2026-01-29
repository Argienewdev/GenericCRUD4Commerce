package com.app.service;

import com.app.model.Client;
import com.app.repository.ClientRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ClientService {

	private static final Logger LOG = Logger.getLogger(ClientService.class);

	@Inject
	ClientRepository clientRepository;

	public List<Client> getAllClients() {
		LOG.debug("Obteniendo lista de todos los clientes");

		List<Client> clients = clientRepository.listAll();

		LOG.debugf("Total de clientes encontrados: %d", clients.size());

		return clients;
	}

	@Transactional
	public Client createClient(Client client) {
		LOG.debugf("Creando cliente: DNI %s, Nombre: %s", client.dni, client.name);

		if (clientRepository.existsByDni(client.dni)) {
			LOG.warnf("Intento de crear cliente con DNI duplicado: %s", client.dni);
			throw new IllegalArgumentException("Ya existe un cliente registrado con el DNI " + client.dni);
		}

		clientRepository.persist(client);

		LOG.debugf("Cliente creado exitosamente - ID: %d, DNI: %s", client.id, client.dni);

		return client;
	}

	public Optional<Client> getClientByDni(String dni) {
		LOG.debugf("Buscando cliente por DNI: %s", dni);

		Optional<Client> clientOpt = clientRepository.findByDni(dni);

		if (clientOpt.isEmpty()) {
			LOG.debugf("Cliente no encontrado con DNI: %s", dni);
		} else {
			LOG.debugf("Cliente encontrado - ID: %d, DNI: %s", clientOpt.get().id, dni);
		}

		return clientOpt;
	}

	public Optional<Client> getClientById(Long id) {
		LOG.debugf("Buscando cliente por ID: %d", id);

		Optional<Client> clientOpt = clientRepository.findByIdOptional(id);

		if (clientOpt.isEmpty()) {
			LOG.debugf("Cliente no encontrado con ID: %d", id);
		} else {
			LOG.debugf("Cliente encontrado: %s (ID: %d)",
					clientOpt.get().name, id);
		}

		return clientOpt;
	}

	@Transactional
	public Optional<Client> updateClient(Long id, Client newData) {
		LOG.debugf("Actualizando cliente con ID: %d", id);

		Client entity = clientRepository.findById(id);

		if (entity == null) {
			LOG.warnf("Intento de actualizar cliente inexistente - ID: %d", id);
			return Optional.empty();
		}

		entity.name = newData.name;
		entity.address = newData.address;
		entity.phoneNumber = newData.phoneNumber;

		clientRepository.persist(entity);

		LOG.debugf("Cliente actualizado exitosamente - ID: %d, DNI: %s",
				entity.id, entity.dni);

		return Optional.of(entity);
	}

	@Transactional
	public boolean deleteClient(Long id) {
		LOG.debugf("Eliminando cliente con ID: %d", id);

		boolean deleted = clientRepository.deleteById(id);

		if (!deleted) {
			LOG.warnf("Intento de eliminar cliente inexistente - ID: %d", id);
			return false;
		}

		LOG.debugf("Cliente eliminado exitosamente - ID: %d", id);

		return true;
	}
}