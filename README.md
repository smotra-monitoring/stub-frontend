# Smotra Marketing Website

This is the marketing website for the [Smotra monitoring project](https://github.com/smotra-monitoring) - a high-performance distributed monitoring solution built with Rust, Go, and TypeScript.

## Project Structure

```
stub-frontend/
├── .gitignore          # Git ignore patterns
├── .dockerignore       # Docker ignore patterns
├── README.md           # This file
├── .github/
│   └── copilot-instructions.md  # AI agent instructions
├── deployments/
│   ├── Dockerfile      # Docker build configuration
│   └── nginx.conf      # Nginx configuration
├── docs/
│   ├── REMOTE_AGENT.md # Agent documentation (reference)
│   └── SERVER.md       # Server documentation (reference)
├── public/
│   ├── index.html      # Main website
│   ├── styles/
│   │   └── custom.css  # Custom styles (if needed)
│   ├── assets/
│   │   └── images/     # Images and icons
│   └── dist/
│       └── main.js     # Compiled JavaScript (gitignored)
└── src/
    └── main.ts         # TypeScript source (if needed)
```

## Technology Stack

- **HTML5**: Semantic markup
- **CSS**: [Bulma framework](https://bulma.io/)
- **Icons**: [Font Awesome 6](https://fontawesome.com/)
- **TypeScript**: For any interactive features (optional)
- **Docker**: nginx:alpine for deployment

## Development

### Local Development

Serve the static files locally for development:

```bash
# Using Python
cd public && python -m http.server 8000

# Using Node.js
npx serve public

# Then open http://localhost:8000
```

### Working with TypeScript (Optional)

If you need to add interactive features:

```bash
# Install TypeScript
npm install -g typescript

# Compile TypeScript
tsc src/main.ts --outDir public/dist --target ES2020

# Watch mode for development
tsc src/main.ts --outDir public/dist --target ES2020 --watch
```

## Docker Deployment

### Build the Docker Image

```bash
docker build -f deployments/Dockerfile -t smotra-frontend .
```

### Run the Container

```bash
# Run on port 80
docker run -d -p 80:80 smotra-frontend

# Or on a custom port (e.g., 8080)
docker run -d -p 8080:80 smotra-frontend

# Then open http://localhost or http://localhost:8080
```

### Health Check

The container includes a health check endpoint:

```bash
curl http://localhost/health
```

## About Smotra

**Smotra** is a distributed monitoring solution designed for performance and reliability:

- **Agent (Rust)**: Lightweight monitoring agent with ICMP ping, plugin system, and TUI
- **Server (Go)**: Central server with RESTful API, PostgreSQL/SQLite support
- **OpenAPI**: Comprehensive API specification

### Repositories

- **Organization**: https://github.com/smotra-monitoring
- **Agent**: https://github.com/smotra-monitoring/agent
- **Server**: https://github.com/smotra-monitoring/server
- **OpenAPI**: https://github.com/smotra-monitoring/openapi

## Contributing

The Smotra project is under active development and welcomes contributors! Visit our [GitHub organization](https://github.com/smotra-monitoring) to get started.

## License

See individual component repositories for licensing information.
