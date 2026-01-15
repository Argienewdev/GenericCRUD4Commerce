package com.app.dto;

import com.app.model.User;

public record CreateUserRequest(
		String username,
		String password,
		User.Role role) {
}