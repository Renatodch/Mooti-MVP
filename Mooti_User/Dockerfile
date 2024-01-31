FROM node:14-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run tsc
EXPOSE 8003
CMD ["node", "/app/build/Routes/UserRoutes.js"]