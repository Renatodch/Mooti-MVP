FROM node:14-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run tsc
EXPOSE 8004
CMD ["node", "/app/build/index.js"]