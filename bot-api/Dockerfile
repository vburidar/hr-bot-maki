# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the application port (default for NestJS is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
