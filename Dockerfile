# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of app
COPY . .

# Build the Angular app and SSR server
RUN npm run build:ssr

# Expose port
EXPOSE 4000

# Start the app
CMD ["npm", "run", "serve:ssr"]
