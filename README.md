[![Netlify Status](https://api.netlify.com/api/v1/badges/995873ec-f2ec-435c-8c66-cd476d5b9105/deploy-status)](https://app.netlify.com/projects/museeimaginaire/deploys)

A live demo of the project can be viewed [here](https://museeimaginaire.netlify.app).

1. clone the repo
2. install the dependencies with `npm run i`
3. create a .env file and add the url to your postgres database. the .env.example file shows you what it should look like
4. You will also need to [request an API key from the Harvard Art Museums' website](https://harvardartmuseums.org/collections/api), and add your key to your .env file. refer to the .env.example file for what this should look like.
5. set up your database with `npm run db:push` then run `npm run db:migrate`
6. once the changes have been successfully applied, start the server with `npm run dev -- --open`
