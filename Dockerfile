#
# twilio-taskrouter-contact-center web server
#
FROM node:8.9.4
LABEL vendor="KDDI Web Communications inc." \
    maintainer="yuto.yamada@kddi-web.com"

# Install required package
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    --no-install-recommends \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y \
    yarn \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install required node library
RUN yarn install

# Bundle app source
COPY . .

CMD ["tail", "-f", "/dev/null"]
#CMD ["yarn", "run", "start:dev"]
