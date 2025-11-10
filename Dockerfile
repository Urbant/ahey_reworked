# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Build deps for native modules like better-sqlite3
RUN apk add --no-cache python3 make g++

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 824

# Start the application
CMD ["npm", "start"] 