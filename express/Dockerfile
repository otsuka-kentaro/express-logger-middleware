FROM node:12.15.0-alpine

WORKDIR /app

# install dependencies
COPY package*.json /app/
RUN npm ci

EXPOSE 3000

CMD ["npm", "start"]
