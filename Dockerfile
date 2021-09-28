# pull official base image
FROM node:12 as admin_dash

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./

RUN npm install

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

# add app
COPY . .

#Build the
RUN npm run build

FROM nginx:latest

EXPOSE 80

COPY --from=admin_dash /app/build/ /var/www/html/admin_build/

COPY /nginx/default.conf /etc/nginx/conf.d

# start app
CMD ["nginx","-g", "daemon off;"]
