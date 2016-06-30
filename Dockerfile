FROM gliderlabs/alpine:3.2
MAINTAINER Yevgeniy Brikman <jim@ybrikman.com>

# Install all the dependencies for Jekyll
RUN apk-install bash build-base libffi-dev zlib-dev libxml2-dev libxslt-dev ruby ruby-dev nodejs

# Install Jekyll
RUN gem install bundler jekyll --no-ri --no-rdoc

# Install nokogiri separately because it's special
RUN gem install nokogiri -v 1.6.7.2 -- --use-system-libraries

# Install grunt
RUN npm install -g grunt-cli

# Copy the package.json file into the image and run npm install in a
# way that will be cached. See: http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Copy the Gemfile and Gemfile.lock into the image and run bundle install in a
# way that will be cached
WORKDIR /tmp
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
RUN bundle install

# Copy source
RUN mkdir -p /src
VOLUME ["/src"]
WORKDIR /src
ADD . /src

# Jekyll runs on port 4000 by default
EXPOSE 4000

# Run jekyll serve
CMD ["./npm-start.sh"]