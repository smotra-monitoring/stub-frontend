# Smotra Marketing Website - Agent Instructions

## Project Purpose
This is a **stub frontend repository** for a one-page marketing website describing the Smotra monitoring project. The actual Smotra implementation exists in separate repositories (Rust agent, Go server). This repo will contain only the static marketing website.

## Architecture Overview
- **Single-page marketing site**: No application logic, pure informational content
- **Technology stack**: Vanilla HTML, CSS (Bulma framework), and TypeScript (if needed)
- **Content sources**: [docs/REMOTE_AGENT.md](docs/REMOTE_AGENT.md) and [docs/SERVER.md](docs/SERVER.md) document the actual project components
- **Target audience**: Potential users and contributors to the Smotra monitoring ecosystem
- **File organization**: Root folder contains only essential files; content organized into `public/`, `src/`, and `docs/` directories

## Technology Constraints (CRITICAL)
- **CSS Framework**: Bulma only. NO Bootstrap. NO Tailwind.
- **JavaScript**: Vanilla TypeScript only if JS is needed. NO frameworks (no React/Vue/Angular).
- **Build setup**: If TypeScript is used, simple `tsc` compilation (no webpack/vite/parcel unless explicitly requested)
- **Deployment**: Docker container with nginx base image serving static files

## Project Context
**Smotra** is a distributed monitoring solution:
- **Agent**: Rust-based monitoring agent with ICMP ping, plugin system, TUI (repo: https://github.com/smotra-monitoring/agent)
- **Server**: Go-based central server with API, PostgreSQL/SQLite support (repo: https://github.com/smotra-monitoring/server)
- **Status**: Under active development (not production-ready)

## Content Requirements
1. **Hero section**: Clear explanation of what Smotra is (distributed monitoring, Rust/Go/TypeScript stack)
2. **Architecture overview**: Visual/textual explanation of agent-server architecture
3. **Key features**: Extract from REMOTE_AGENT.md and SERVER.md
4. **Call-to-action**: Invite contributors and early adopters (project is under construction)
5. **Links**: Include all GitHub org repositories (https://github.com/smotra-monitoring)

## SEO Keywords (Must Include)
- monitoring solution, rust monitoring, go monitoring, typescript monitoring
- high performance monitoring, reliable monitoring, open source monitoring
- distributed monitoring, ICMP monitoring, network monitoring
- monitoring agent, monitoring server, self-hosted monitoring

## Workflow for Implementing the Website
1. **Read documentation first**: Review docs/REMOTE_AGENT.md and docs/SERVER.md to extract accurate feature lists
2. **Create HTML structure**: Semantic HTML5 in public/index.html with proper headings, sections, and meta tags
3. **Style with Bulma**: Use Bulma CSS classes, no custom CSS unless necessary
4. **Add TypeScript sparingly**: Only if interactivity is needed (smooth scrolling, collapsible sections)
5. **Test locally**: Use a simple HTTP server from the public/ directory

## File Structure (When Implemented)
```
stub-frontend/
├── .gitignore          # Git ignore patterns
├── .dockerignore       # Docker ignore patterns
├── README.md           # Setup and deployment instructions
├── .github/
│   └── copilot-instructions.md  # This file (AI agent instructions)
├── deploy/
│   ├── Dockerfile      # Docker build configuration
│   └── nginx.conf      # Nginx configuration for Docker
├── docs/
│   ├── REMOTE_AGENT.md # Agent documentation (reference only)
│   └── SERVER.md       # Server documentation (reference only)
├── public/
│   ├── index.html      # Main one-page site
│   ├── styles/
│   │   └── custom.css  # Minimal overrides for Bulma (if needed)
│   ├── assets/
│   │   └── images/     # Logos, diagrams, icons
│   └── dist/
│       └── main.js     # Compiled JS (gitignored)
└── src/
    └── main.ts         # TypeScript source (if needed)
```

**Root folder principle**: Only essential files at root (.gitignore, README.md, .dockerignore). All other content organized into directories:
- `public/` - Static web content served by nginx
- `src/` - TypeScript source files
- `docs/` - Documentation files
- `deploy/` - Deployment configuration (Docker, nginx)
- `.github/` - GitHub-specific files

## Design Philosophy
- **Clean and modern**: Minimalist design, easy to scan
- **Mobile-responsive**: Bulma handles this by default
- **Fast loading**: No heavy dependencies, minimal JS
- **Positive messaging**: Frame "under construction" as an opportunity to join early

## Common Tasks
### Creating the initial HTML structure
- Extract key features from docs/REMOTE_AGENT.md and docs/SERVER.md
- Create public/index.html using Bulma components: hero, section, columns, cards
- Include OpenGraph meta tags for social sharing

### Adding interactivity (if needed)
- TypeScript for smooth scrolling to anchors
- Simple toggle for FAQ/feature sections
- No complex state management

### Testing changes
```bash
# During development - serve from public/ directory
cd public && python -m http.server 8000
# Or: npx serve public

# Test with Docker (production-like)
docker build -f deploy/Dockerfile -t smotra-frontend .
docker run -p 8080:80 smotra-frontend

# Then open http://localhost:8080
```

### Compiling TypeScript (if used)
```bash
# Install TypeScript globally or locally
npm install -g typescript

# Compile (src/ → dist/)
tsc src/main.ts --outDir dist --target ES2020

# Or with tsconfig.json for better configuration
tsc
```

### Docker Deployment
The site is deployed in an nginx-based Docker container.

**Dockerfile structure** (deploy/Dockerfile):
```dockerfile
FROM nginx:alpine

# Copy nginx configuration
COPY deploy/nginx.conf /etc/nginx/nginx.conf

# Copy all static files from public/ directory
COPY public/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** should include:
- Gzip compression for HTML/CSS/JS
- Proper MIME types
- Cache headers for static assets
- Security headers (X-Frame-Options, X-Content-Type-Options)

**Build and run**:
```bash
# Build image
docker build -f deploy/Dockerfile -t smotra-frontend .

# Run container
docker run -d -p 80:80 smotra-frontend

# Or with custom port
docker run -d -p 8080:80 smotra-frontend
```

## What NOT to Do
- Don't add build tools unless absolutely necessary
- Don't use CSS-in-JS or styled-components
- Don't implement monitoring functionality (this is just a marketing site)
- Don't create separate routes/pages (single-page only)
- Don't add backend code (static site only)

## GitHub Repository Links (Include on Website)
- Organization: https://github.com/smotra-monitoring
- Agent: https://github.com/smotra-monitoring/agent (Rust)
- Server: https://github.com/smotra-monitoring/server (Go)
- OpenAPI: https://github.com/smotra-monitoring/openapi (API specification)


