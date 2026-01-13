# -------------------- STAGE 1: BUILD --------------------
# Use a full JDK + Maven image to compile the application
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Set working directory inside the container
WORKDIR /workspace

# Copy only the Maven descriptor first
# This allows Docker to cache dependencies
COPY pom.xml .

# Download all dependencies in advance (offline mode)
RUN mvn dependency:go-offline

# Copy the source code
COPY src src

# Package the application without running tests
RUN mvn package -DskipTests

# -------------------- STAGE 2: RUNTIME --------------------
# Use a lightweight JRE image for production
FROM eclipse-temurin:21-jre-alpine

# Set working directory for the runtime container
WORKDIR /app

# Quarkus produces a "fast-jar" structure inside target/quarkus-app
# We must copy all required parts
COPY --from=build /workspace/target/quarkus-app/lib/ /app/lib/
COPY --from=build /workspace/target/quarkus-app/*.jar /app/
COPY --from=build /workspace/target/quarkus-app/app/ /app/app/
COPY --from=build /workspace/target/quarkus-app/quarkus/ /app/quarkus/

# Expose the HTTP port
EXPOSE 8080

# Create a non-root user for security reasons
RUN addgroup -S quarkus && adduser -S quarkus -G quarkus

# Switch to the non-root user
USER quarkus

# Start the Quarkus application
CMD ["java", "-jar", "/app/quarkus-run.jar"]