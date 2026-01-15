package com.app.security;

import com.app.model.User;
import jakarta.interceptor.InterceptorBinding;
import java.lang.annotation.*;

// Annotation to secure endpoints
@InterceptorBinding
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Secured {
    User.Role[] roles() default {};
}