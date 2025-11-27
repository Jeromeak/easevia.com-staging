# Use Node.js Slim version (lightweight image)
FROM node:20-slim

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Expose port (used by dev server)
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
