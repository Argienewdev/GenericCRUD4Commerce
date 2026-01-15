package com.app.dto;

public record ApiResponse(
		boolean success,
		String message) {
}