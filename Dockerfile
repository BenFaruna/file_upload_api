# Use an official Node.js runtime as a parent image
FROM node:alpine3.17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Expose the port your Express app will run on (change this if necessary)
EXPOSE 3000

# Command to run your Express application
CMD ["npm", "run", "send-receive"]
