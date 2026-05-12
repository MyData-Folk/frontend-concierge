# Étape 1 : Construction (Build)
FROM node:20-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Serveur de production (Nginx)
FROM nginx:stable-alpine

# Copier la configuration Nginx personnalisée pour gérer le routage SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits vers le répertoire de service d'Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
