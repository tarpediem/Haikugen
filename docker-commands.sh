#!/bin/bash

# Haikugen Docker Management Script
# This script provides easy commands for managing the Haikugen Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env_file() {
    if [[ ! -f .env ]]; then
        print_warning ".env file not found. Please copy .env.example to .env and configure your API key."
        exit 1
    fi
}

# Development commands
dev_up() {
    print_status "Starting development environment..."
    check_env_file
    docker-compose -f docker-compose.dev.yml up --build
}

dev_up_detached() {
    print_status "Starting development environment in background..."
    check_env_file
    docker-compose -f docker-compose.dev.yml up -d --build
    print_success "Development environment started. Access at http://localhost:5173"
}

dev_down() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped."
}

dev_logs() {
    print_status "Showing development logs..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Production commands
prod_up() {
    print_status "Starting production environment..."
    check_env_file
    docker-compose up --build
}

prod_up_detached() {
    print_status "Starting production environment in background..."
    check_env_file
    docker-compose up -d --build
    print_success "Production environment started. Access at http://localhost:8080"
}

prod_down() {
    print_status "Stopping production environment..."
    docker-compose down
    print_success "Production environment stopped."
}

prod_logs() {
    print_status "Showing production logs..."
    docker-compose logs -f
}

# Build commands
build_dev() {
    print_status "Building development image..."
    docker build -f docker/Dockerfile.dev -t haikugen:dev .
    print_success "Development image built successfully."
}

build_prod() {
    print_status "Building production image..."
    check_env_file
    docker build -f docker/Dockerfile -t haikugen:latest --build-arg VITE_OPENROUTER_API_KEY="$(grep VITE_OPENROUTER_API_KEY .env | cut -d '=' -f2)" .
    print_success "Production image built successfully."
}

# Utility commands
clean() {
    print_status "Cleaning up Docker resources..."
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed."
}

health_check() {
    print_status "Checking container health..."
    
    # Check development container
    if docker ps | grep -q "haikugen-dev"; then
        if docker exec haikugen-dev wget --no-verbose --tries=1 --spider http://localhost:5173/ 2>/dev/null; then
            print_success "Development container is healthy."
        else
            print_error "Development container is unhealthy."
        fi
    else
        print_warning "Development container is not running."
    fi
    
    # Check production container
    if docker ps | grep -q "haikugen-prod"; then
        if docker exec haikugen-prod curl -f http://localhost:80/health 2>/dev/null; then
            print_success "Production container is healthy."
        else
            print_error "Production container is unhealthy."
        fi
    else
        print_warning "Production container is not running."
    fi
}

# Docker Hub commands
docker_login() {
    print_status "Logging in to Docker Hub..."
    docker login
    print_success "Logged in to Docker Hub successfully."
}

docker_push() {
    if [[ $# -eq 0 ]]; then
        print_error "Usage: $0 push <username>"
        exit 1
    fi
    
    USERNAME=$1
    print_status "Tagging and pushing image to Docker Hub..."
    
    docker tag haikugen:latest $USERNAME/haikugen:latest
    docker push $USERNAME/haikugen:latest
    
    print_success "Image pushed to Docker Hub as $USERNAME/haikugen:latest"
}

# Show usage
usage() {
    echo "Haikugen Docker Management Script"
    echo "Usage: $0 <command>"
    echo ""
    echo "Development Commands:"
    echo "  dev-up              Start development environment (foreground)"
    echo "  dev-up-bg           Start development environment (background)"
    echo "  dev-down            Stop development environment"
    echo "  dev-logs            Show development logs"
    echo ""
    echo "Production Commands:"
    echo "  prod-up             Start production environment (foreground)"
    echo "  prod-up-bg          Start production environment (background)"
    echo "  prod-down           Stop production environment"
    echo "  prod-logs           Show production logs"
    echo ""
    echo "Build Commands:"
    echo "  build-dev           Build development image"
    echo "  build-prod          Build production image"
    echo ""
    echo "Utility Commands:"
    echo "  clean               Clean up Docker resources"
    echo "  health              Check container health"
    echo "  login               Login to Docker Hub"
    echo "  push <username>     Tag and push to Docker Hub"
    echo ""
    echo "Examples:"
    echo "  $0 dev-up-bg        # Start development server in background"
    echo "  $0 prod-up-bg       # Start production server in background"
    echo "  $0 build-prod       # Build production image"
    echo "  $0 push myusername  # Push to Docker Hub"
}

# Main command handler
case "${1:-}" in
    dev-up)
        dev_up
        ;;
    dev-up-bg)
        dev_up_detached
        ;;
    dev-down)
        dev_down
        ;;
    dev-logs)
        dev_logs
        ;;
    prod-up)
        prod_up
        ;;
    prod-up-bg)
        prod_up_detached
        ;;
    prod-down)
        prod_down
        ;;
    prod-logs)
        prod_logs
        ;;
    build-dev)
        build_dev
        ;;
    build-prod)
        build_prod
        ;;
    clean)
        clean
        ;;
    health)
        health_check
        ;;
    login)
        docker_login
        ;;
    push)
        docker_push "${2:-}"
        ;;
    *)
        usage
        ;;
esac