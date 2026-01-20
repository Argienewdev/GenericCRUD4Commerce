package com.app.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sessions")
public class Session {

	@Id
	@GeneratedValue
	@Column(nullable = false, updatable = false)
	private UUID id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "expires_at", nullable = false)
	private LocalDateTime expiresAt;

	@Column(name = "last_activity", nullable = false)
	private LocalDateTime lastActivity;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		lastActivity = LocalDateTime.now();
		expiresAt = LocalDateTime.now().plusHours(24);
	}

	public boolean isValid() {
		return LocalDateTime.now().isBefore(expiresAt);
	}

	public void updateActivity() {
		lastActivity = LocalDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getExpiresAt() {
		return expiresAt;
	}

	public LocalDateTime getLastActivity() {
		return lastActivity;
	}
}
