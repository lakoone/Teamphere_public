FROM node:20.10

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm i
RUN npm i -g nodemon ts-node

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 5000
CMD ["npm","run","startCluster"]