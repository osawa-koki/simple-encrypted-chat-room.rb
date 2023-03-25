FROM node:18 as client_build
WORKDIR /src
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn install
COPY ./client .
RUN yarn build

FROM ruby:3.2.1 as server_build
WORKDIR /app
EXPOSE 8000
COPY ./server/Gemfile ./server/Gemfile.lock ./
RUN gem install bundler && bundle install
COPY ./server .
RUN rails db:migrate RAILS_ENV=production
COPY --from=client_build /src/dist ./public
CMD bundle exec puma -e production -p 8000
