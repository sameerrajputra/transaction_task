## Running the app

1. Keep running Docker
2. Inside project directory, do the below steps:

```bash
# docker create container
$ docker-compose up

# install dependencies
$ yarn install

#run migration | seed
$ npx prism migrate dev

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
