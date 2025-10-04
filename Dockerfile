############
# Build
############
FROM node:16-buster-slim as build
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN HUSKY="0" npm install --no-audit --production=false

COPY ./ ./
RUN npm run build

############
# Final
############
FROM node:16-buster-slim as final
ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update; \
  apt-get install -y --no-install-recommends curl \
  ; \
  apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false; \
  rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm set-script prepare "" \
  && HUSKY="0" npm install --no-audit --omit=dev

COPY --from=build /app/dist ./

EXPOSE 3001
CMD ["node", "src/main"]
