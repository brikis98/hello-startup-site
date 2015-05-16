FROM phusion/baseimage:0.9.16
MAINTAINER Yevgeniy Brikman <jim@ybrikman.com>

CMD ["/sbin/my_init"]

# Install Ruby and Node. Apt only has Ruby 1.9.x, but we need 2.0+, so add an
# extra repo, and install ruby 2.2 piece by piece (including a couple annoying
# dependencies just to make nokogiri happy). Oh, and it turns out Jekyll's 
# syntax highlighting using pygments depends on python being installed. 
RUN apt-add-repository -y ppa:brightbox/ruby-ng && apt-get update
RUN apt-get install -y make ruby2.2 ruby2.2-dev zlib1g-dev patch python nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install grunt
RUN npm install -g grunt-cli

# Install Jekyll
RUN gem install bundler jekyll --no-ri --no-rdoc

# Copy the package.json file into the image and run npm install in a
# way that will be cached. See: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Source code will be in /src
VOLUME ["/src"]
WORKDIR /src
ADD . /src

# Jekyll runs on port 4000 by default
EXPOSE 4000

# Run start script when the container starts
RUN mkdir -p /etc/my_init.d
COPY npm-start.sh /etc/my_init.d/npm-start.sh

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*