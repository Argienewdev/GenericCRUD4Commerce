package com.app.dto;

public record LoginResponse(
		boolean success,
		String message,
		UserInfo user) {
}