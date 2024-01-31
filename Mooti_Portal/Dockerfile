FROM node:14-alpine

WORKDIR /app
COPY . .
RUN npm install
#RUN npm run build
EXPOSE 8080
#RUN npm start
#CMD ["webpack-dev-server","--open --mode development"]
CMD ["node","server.js"]