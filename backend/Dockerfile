# --- ETAPA 1: BUILD ---
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copiamos el pom.xml y descargamos dependencias (modo offline para velocidad futura)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y empaquetamos
COPY src src
RUN mvn package -DskipTests

# --- ETAPA 2: RUN ---
# Usamos una imagen JRE (Runtime Environment) que es más ligera que el JDK completo
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Quarkus genera la salida en target/quarkus-app/
# Necesitamos copiar el jar runner, la carpeta lib, y la carpeta app/
COPY --from=build /workspace/target/quarkus-app/lib/ /app/lib/
COPY --from=build /workspace/target/quarkus-app/*.jar /app/
COPY --from=build /workspace/target/quarkus-app/app/ /app/app/
COPY --from=build /workspace/target/quarkus-app/quarkus/ /app/quarkus/

EXPOSE 8080

# Usuario no root por seguridad
RUN addgroup -S quarkus && adduser -S quarkus -G quarkus
USER quarkus

CMD ["java", "-jar", "/app/quarkus-run.jar"]