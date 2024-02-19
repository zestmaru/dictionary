# syntax=docker/dockerfile:1

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the npm builder container to the nginx container
COPY ./build/. /usr/share/nginx/html/. 

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
