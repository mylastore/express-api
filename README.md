# Express API server with user authentication, forgot password and user roles

## Note

This backend was inspired by of an awesome course from udemy [Reference](https://www.udemy.com/course/vue-js-2-the-full-guide-by-real-apps-vuex-router-node/)

## Included

- Built to work with this Svelte JS frontend git repo [svelte-parcel](https://github.com/mylastore/svelte-parcel.git) 
- The brilliantly simple, babel-less, bundle-less ECMAScript module loader [esm](https://github.com/standard-things/esm#readme)
- User authentication using JWT token
- User passwrod requirements (min length 8, 1 capital letter, 1 special character)
- User profile page with [gravatar](https://en.gravatar.com/)
- User forgot password
- User roles (customer, admin etc)
- Forms with Nodemailer [Nodemailer](https://nodemailer.com/about/) and Sendgrid [Sendgrid](https://sendgrid.com/)

## Project setup
Rename the example.env to .env and add your credentials. 
```
npm i
```

### Compiles and hot-reloads for development
```
npm start
```
  
### Sample User DATA (Warning! will errase mongodb data and add sample data)
This will add sample users, meetups, categories, threads & posts to mongoDB
```
npm run seed
```

### Frontend code can be found here

Reference [Frontend Git Repo Built with Svelte JS and Parcel](https://github.com/mylastore/svelte-parcel.git)


### This git repo url: [Express API](https://github.com/mylastore/express-api.git)

### Todo

Implement tests

Complete meetups example APP 

Better error handling