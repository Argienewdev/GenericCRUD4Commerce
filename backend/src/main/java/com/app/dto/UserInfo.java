package com.app.dto;

import com.app.model.User;

public record UserInfo(
		Long id,
		String username,
		User.Role role,
		boolean active) {
	public static UserInfo fromUser(User user) {
		return new UserInfo(
				user.getId(),
				user.getUsername(),
				user.getRole(),
				user.isActive());
	}
}
