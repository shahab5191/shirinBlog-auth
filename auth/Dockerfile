#Build Stage
FROM node:alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "tsc"]

#Production Stage
FROM node:alpine as prod
RUN apk add --no-cache tini
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/build ./build
ENV PORT=4000
EXPOSE 4000
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["node","./build/index.js"]

#Development Stage
FROM prod
RUN apk add --no-cache tini
WORKDIR /app
COPY package*.json ./
RUN npm install --development
COPY . .
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["npm", "run","dev"]