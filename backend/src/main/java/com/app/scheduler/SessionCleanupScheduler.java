package com.app.scheduler;

import com.app.service.AuthService;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

@ApplicationScoped
public class SessionCleanupScheduler {

    private static final Logger LOG = Logger.getLogger(SessionCleanupScheduler.class);

    @Inject
    AuthService authService;

    /**
     * Cleans expired sessions every hour
     * Cron: 0 minutes, every hour
     */
    @Scheduled(cron = "0 0 * * * ?") // Every hour, o'clock (00:00, 01:00, 02:00...)
    void cleanupExpiredSessions() {
        LOG.info("Iniciando limpieza programada de sesiones expiradas...");
        authService.cleanExpiredSessions();
        LOG.info("Limpieza de sesiones completada");
    }
}