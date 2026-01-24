package com.app.repository;

import com.app.model.Session;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class SessionRepository implements PanacheRepositoryBase<Session, UUID> {

	public Optional<Session> findValidSession(UUID sessionId) {
		return find("id = ?1 and expiresAt > ?2", sessionId, LocalDateTime.now())
				.firstResultOptional();
	}

	public void deleteExpiredSessions() {
		delete("expiresAt < ?1", LocalDateTime.now());
	}

	public void deleteByUserId(Long userId) {
		delete("user.id = ?1", userId);
	}
}