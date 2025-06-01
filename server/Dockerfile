# /server/Dockerfile

FROM node:20

WORKDIR /app

# Copiamos package.json y tsconfig para instalar deps y compilar
COPY package*.json tsconfig*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos Prisma Client (requiere prisma/schema y .env)
RUN npx prisma generate

# Compilamos TypeScript
RUN npm run build

# Expone puerto del backend
EXPOSE 3000

# Comando para ejecutar
CMD ["node", "dist/server.js"]
