# Base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm ci

# Build Angular SSR app
RUN npm run build

# Expose port
EXPOSE 4000

# Start the SSR server
CMD ["npm", "run", "serve:ssr"]
