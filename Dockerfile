# Usa una imagen ligera de Node
FROM node:22-alpine

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero (aprovecha la caché de Docker)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usa tu backend (asumiendo que es el 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]