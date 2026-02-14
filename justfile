set dotenv-load

default:
    @just --list

# Pull Docker images and download VRM model
setup:
    docker compose pull
    cd web && bun run download-model

# Start all services (Docker + API + Frontend)
dev:
    mprocs --config mprocs/dev.yaml
