#Base image
FROM node:alpine as base
ENV NODE_ENV=production
WORKDIR /opt
COPY package*.json ./
RUN npm ci\
  && npm cache clean --force

#Build Stage
FROM base as build
ENV NODE_ENV=development
ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm run build

#Development Stage
FROM base as dev
ENV NODE_ENV=development
ENV PATH=/opt/node_modules/.bin:$PATH
RUN apk add --no-cache tini
WORKDIR /opt
COPY package*.json ./
RUN npm install --development
WORKDIR /opt/app
COPY . .
ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["npm", "run","dev"]

#Production Stage
FROM base as prod
RUN apk add --no-cache tini
WORKDIR /opt/app
COPY . .
ENV PORT=4000
EXPOSE 4000
ENTRYPOINT [ "/sbin/tini", "--" ]
COPY --from=build /opt/app/build build/
CMD ["node","./build/index.js"]