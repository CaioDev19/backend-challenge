FROM node:18

WORKDIR /app

COPY .yarn/releases/yarn-4.3.1.cjs .yarn/releases/yarn-4.3.1.cjs
COPY .yarnrc.yml .yarnrc.yml

COPY package.json yarn.lock ./
RUN node .yarn/releases/yarn-4.3.1.cjs install

COPY . .

RUN node .yarn/releases/yarn-4.3.1.cjs build

EXPOSE 8080

CMD ["node", ".yarn/releases/yarn-4.3.1.cjs", "start:prod"]
