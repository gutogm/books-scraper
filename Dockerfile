FROM node:8.15-jessie-slim

RUN apt-get update
RUN apt-get install -y git

ENV APP_NAME .
ENV APP_FOLDER /application

ENV APP_NAME .
ENV APP_FOLDER /application

RUN mkdir -p /application
COPY $APP_NAME $APP_FOLDER

WORKDIR ${APP_FOLDER}
RUN rm -rf node_modules
RUN rm -rf package-lock.json

RUN npm install --quiet --only=production

CMD ["npm", "run", "app"]