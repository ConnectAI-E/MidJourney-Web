# Use Node.js v18 as the base image
FROM node:18

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@latest

# Copy package.json file from the midjourney-web folder
COPY package.json .

# Copy pnpm-lock.yaml file from the midjourney-web folder
COPY pnpm-lock.yaml .

# Install dependencies
RUN pnpm install

# Copy the rest of the application code from the midjourney-web folder
COPY . .

# Compile TypeScript
RUN pnpm run build

# Expose the application port
EXPOSE 4173 9899

# Start the application
CMD ["pnpm", "run", "serve"]
