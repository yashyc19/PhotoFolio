# install node image
FROM node:14.15.4

# create a working directory
WORKDIR /app

# copy the project files to the working directory
COPY . .

# expose the port the app runs on, 5500
EXPOSE 5500

# install dependencies
RUN npm install

# start the app
CMD ["npm", "run", "start"]