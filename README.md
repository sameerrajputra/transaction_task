## Running the app

1. Keep running Docker
2. Inside project directory, create a .env file .
3. You can copy .env.sample to .env file and then do the below steps:

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
