FROM nginx:alpine

# Copy nginx configuration
COPY  deployments/nginx.conf /etc/nginx/nginx.conf

# Copy all static files from public/ directory
COPY public/ /usr/share/nginx/html/

# Ensure proper permissions
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]