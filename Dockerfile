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
ENV HOME=/usr/src/app
WORKDIR $HOME

# Create user
RUN useradd --user-group --create-home --shell /bin/false app
RUN chown -R app:app $HOME
USER app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install required node library
RUN yarn install

CMD ["yarn", "run", "start"]
