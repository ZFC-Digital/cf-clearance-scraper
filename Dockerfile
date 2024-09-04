# Use the official Node.js image as the base image
FROM node:current-slim

# Install necessary dependencies for running Chrome
RUN apt-get update -qq \
  && apt-get install -qq --no-install-recommends \
    ca-certificates chromium xvfb \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && ln -s /usr/bin/chromium /usr/bin/google-chrome

# Set up the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm update
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
