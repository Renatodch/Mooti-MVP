FROM node:14-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run tsc
EXPOSE 8888
EXPOSE 8765
EXPOSE 8764
EXPOSE 8777

CMD ["node", "/app/build/index.js"]