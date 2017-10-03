FROM node:0.12

# Create app directory
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080
CMD [ "node", "app" ]