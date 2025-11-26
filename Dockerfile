FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false 
RUN npm run build

# Install a simple static file server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "80"]
