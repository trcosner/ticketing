FROM node:20.19.1-alpine


WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .
CMD ["npm", "start"]