# Stage 1: Build the React app
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install with legacy peer deps to handle react-facebook-login conflict
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config for React Router and API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]