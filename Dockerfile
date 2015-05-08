FROM ruby:2.1.6
MAINTAINER Yevgeniy Brikman <jim@ybrikman.com>

# Install Node.js and NPM
RUN apt-get update
RUN apt-get install -y nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install grunt
RUN npm install -g grunt-cli

# Install Jekyll
RUN gem install jekyll

# Source code will be in /src
RUN mkdir -p /src
VOLUME ["/src"]
WORKDIR /src

# Copy the package.json file into the image and run npm install in a
# way that will be cached
# Pre-install node packages in a way that is cache-friendly
COPY package.json /src/package.json
RUN cd /src && npm install

# Copy the rest of the source code
COPY . /src

# Jekyll runs on port 4000 by default
EXPOSE 4000

# Have to force "watch" and "polling" as inotify doesn't work via Docker
CMD ["npm", "start"]