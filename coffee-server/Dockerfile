FROM node:9
LABEL maintainer="Matthias Seitz <matthias.seitz@tum.de>"
# create application directory
RUN mkdir -p ./app
WORKDIR ./app
COPY ./dist/ ./app
COPY ./public ./public
ENV PORT 4200
EXPOSE 4200
# CMD ["node", "./dist/index.js"]
RUN npm install -g nodemon
CMD ["nodemon", "./dist/index.js""]
