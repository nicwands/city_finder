FROM node:10

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . /app/

EXPOSE 8000
EXPOSE 5000
CMD [ "npm", "start" ]
