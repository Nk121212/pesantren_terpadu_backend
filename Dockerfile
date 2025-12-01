FROM node:20-slim
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 4000
CMD ["yarn","start:prod"]
