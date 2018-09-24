# version  0.0.1
#
# Ubuntu Node.js Dockerfile
#
# https://github.com/dockerfile/ubuntu/blob/master/Dockerfile
# https://docs.docker.com/examples/nodejs_web_app/
#

# Pull base image.
FROM ubuntu:14.04

LABEL maintainer-email="surya@venueluytics.com" maintainer-name="Suryanarayana Mangipudi" version="0.0.1"

RUN apt-get -qq update

# Install Node.js
RUN apt-get install --yes curl \
	&& curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash - \
	&& apt-get install --yes nodejs 

RUN npm install -g pm2

ENV REFRESHED_AT 2018-05-30

VOLUME ["/chatbots"]

# Install app dependencies
WORKDIR /chatbots

ENTRYPOINT ["npm",  "install"]

# Binds to port 9000
EXPOSE  9000

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
 ENTRYPOINT ["pm2", "start", "--no-daemon", "main.js"]
