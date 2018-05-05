
## Create App

  ` ng new angularStripeMongo --routing --style=scss `

  ` npm i @ng-bootstrap/ng-bootstrap `

  ` ng g component home `

  ` ng g component message `

  `  ng g service RestApi `

  ` ng g service DataService `

  - if error... specify main app.module via tag:

    ` ng g c categories --module app `

    ` ng g component PostProduct --module app `



## Server Side Auth

## Test server routes in Postman

* create POST request -> body ->  x-www-form-urlencoded

  ` localhost:3030/api/accounts/signup `

  ` localhost:3030/api/categories `

  ..etc...


  Type in these keys with mock values and send:

  - email

  - password

  - name

    ` localhost:3030/api/accounts/signup `

    .....

## JWT on the frontend, Local Storage

  ` ng g component registration `

## Add a product API Seller

    - add `upload` function in `seller.js` to API

    - in Postman login via POST request:

      - http://localhost:3030/api/accounts/login

      - click x-xxx-form-urlencoded + add login credentials via `email` + `password` + `send`

      - copy `token` that is return via POST request

      - open new tab in Postman and create GET request:

          - http://localhost:3030/api/categories + `send`

      - open 3rd tab + create POST request

        - http://localhost3030/api/seller/products //not working...says no token provided!!

        - click `headers`

          - add `Authorization` as key + new `auth token` as value

        - click on `body` + click on `form-data`

            - add `title` as key + `Hello` as value

            - add `description` as key#2 + `World` as value

            ...`price` = `100`

            ...`categoryId` = `5ae906f4760e7322271f8884`

            ...`product_picture` = change drop down from text to `file` + choose file

            - `send`

            - Go back to application in `S3 console` to view image link

            - Go to `mLab` to view products collection


### AWS

  https://aws.amazon.com/

  https://www.udemy.com/build-amazon-clone-angular5-node/learn/v4/t/lecture/9196454?start=0

  - Login to console -> go to `S3` -> `create bucket` -> `next`
  -> `next` -> `create bucket`


  - go to `services` -> `IAM` -> `users` -> `add new user` (give new name)

      - check `programmatic access` + `AWS Console access ` + `custom password` -> `next permissions`

      - click `Attach existing policies directly` -> checkmark  `AmazonS3FullAccess` -> scroll down and choose `next review`
      -> `create user` -> download credentials

      - go to `Amazon S3` management console (use S3 in searchbar) -> click on new application -> `Permissions` -> `Bucket Policy`

            - open new tab in browser...search AWS Policy Generator

                - select `S3 Bucket Policy` fro policy drop down

                - put `*` in `principal` box

                - checkmark `all actions`

                    - go back to `Amazon S3` management console in other browser tab and copy value for `ARN` + paste ARN value back in policy tab in 2nd browser/policy window + add `/*` to end of ARN value

                - click `add statement`

                - click `generate policy` + copy `policy JSON document`

                - Go back to `S3 management console` + paste in `policy JSON document` -> `Save`

                - This bucket now has public access ..look into ways of securing bucket application

                    NOTE:

                    - to make it so that only admins can post photos for products, first check if the user is an admin on the client side. After that, check on the server if an image is uploaded. If an image is uploaded, then check if the user that has uploaded it is an admin. If the user is an admin, simply save the image to s3. Otherwise, simply skip the uploading of the image


    * Install dependencies

      ` npm i aws-sdk --save `

      ` npm i multer --save `

      ` npm i multer-s3 --save `

      ` npm i faker --save `

    * Faker.js

      https://github.com/marak/Faker.js/


## Server Get products of specific category

  - in `routes/main.js`:
    - `router.get('/categories/:id', (req, res, next) => {`....

## Pagination

  - ` npm i async --save `

  - in `routes/main.js`

      - ` const async = require('async'); `

      - see `router.get('/products', (req, res, next) => { ...`

## Getting a single product API

  - in `routes/main.js`

      - see ` router.get('/product/:id', (req, res, next) => { `


## Getting all products API    

  - in `routes/main.js`

    - see ` router.get('/products', (req, res, next) => { ...`


## Front End Pagination

   -   ` ng g component Category --module app `

   - import in `app-routing.module.ts`

        - `   {
                path: 'categories/:id',
                component: CategoryComponent,
              },`

## Create Category Component

  - ` ng g component Category --module app `

  - import in `app.routing.module.ts`

## Create Product Component

  - ` ng g component Product --module app `

  - import in `app.routing.module.ts`

## Add product cards to homepage

  - in `home.component.ts`

      -

## Backend Create a Review Schema

## Backend Create a Review API POST

  - in `routes/main.js`

    - import `Review` Schema

    - add `.populate('reviews')` to `router.get('/categories/:id', (req, res, next) => {....`

    - add `.deepPopulate('reviews.owner')` to `router.get('/product/:id', (req, res, next) => {...`

    - add POST request for `review`:

      `router.post('/review', mid.checkJWT, (req, res, next) => {....`

    - reference `review` in `Product` Schema

    https://www.udemy.com/build-amazon-clone-angular5-node/learn/v4/t/lecture/9197042?start=0

## Install deepPopulate on server

  ` npm i mongoose-deep-populate --save `

  - in `models/product.js` :

  ` const deepPopulate =  require('mongoose-deep-populate')(mongoose); `

## Calculate Avg rating using Virtuals on Product schema

    - Generates avg rating on the fly...does save to database

## Angular Post a Review

    - `product.component.ts` -> add `postReview()` function + create an `myReviw` object

    - in `styles.scss` -> add styles for rating bar styling

    - `product.component.html` -> create `<ng-template>` for stars + copy /paste template + add to `category.component.html` + add `<ngb-rating>` as well


## Node.js - Search API with Algolia

  https://www.udemy.com/build-amazon-clone-angular5-node/learn/v4/t/lecture/9261736?start=0

    - https://www.algolia.com/

    - go to `dashboard` -> `indices` -> `add new index` -> give name `angular-stripe-mongo`

    * add Algolia to Products Schema + sync products in DB to cloud in real time


      - ` npm i mongoose-algolia --save `

          - import in `models/product.js` + add as a plugin function

    * Get `App ID` + `Admin API Key` from Algolia dashboard + go back to `indices` -> copy/paste `indice name`


        - add these values to Algolia plugin function in Product Schema


        - ....see that data is synced to Algolia in console + Algolia UI

## Create search API via Algolia

    - ` npm i algoliasearch --save `

    - create new file `product-search.js` in `routes` directory

        - import `algoliasearch`

        - add `appID` + `appKey` + `indice name`

        - add route to `server.js`

    - Go to Postman and test search functionality-> `GET` -> ` localhost:3030/api/search?query=cheese `

## Build Search API w/ Algolia on Front End/Angular

    ` ng g c Search --module app `

    - import + add to `app-routing.module.ts`

    - in `search.component.ts`

        - import `ActivatedRoute, DataService, + RestApiService` + add to `constructor`

    - in `app.component.ts`

        - add `search()` functionality


## Payment API w/Stripe - Angular

  - in `src/app/index.html`

      - add link to `Stripe checkout.js`

  - open `typing.d.ts`

      - declare a Stripe checkout variable:

          ` declare var StripeCheckout: any; `

  - go to https://dashboard.stripe.com/login -> `dashboard` -> `Developers` -> `API keys` -> copy `Publishable key` -> go to `app/src/environments/environment.prod.ts` + `app/src/environments/environment.ts` -> add Stripe `Publishable key`


## Set up Cart Functionality

  - in `data.service.ts` add `cartItems` variable

      - create `getCart()` method

      - create `addToCart()` method

      - create `clearCart()` method

      - create `removeFromCart()` method

  - in `app.component.ts`

      - add ` this.data.cartItems = this.data.getCart().length; ` to constructor

      - set # of cartItems to 0 in `logout()` method

      - in `app.component.html`

          - add `*ngIf="data.cartItems"` to display # of itmes in shopping cart

      - in `product.component.ts`

          - create `addToCart()` method

      - in `product.component.html`

          - add button w/ binding to `addToCart()` method/functionality


## Server routes for Stripe

    -  ` npm i stripe --save `

    - in `server/models`

          - create `orders` model

    - in `server/routes/main.js` create payment API

          - import `Order` model

          - add POST request for payment `router.post('/payment'`

          - import/require `Stripe` + add `test Secret key` from Stripe UI to new Stripe variable


## Set Up Cart Component

    -  ` ng g c Cart --module app `

    - import `services` + `Router` + `environment` in `cart.component.ts`

    - import + add path to `app-routing.module.ts`

    - place order in test mode + check new Gross volume/payment(s) in Stripe UI

## Node- Payment API with Stripe

    - in `routes/account.js`

        - create GET route to search for the owner field using the `Order` schema

            - `router.get('/orders/:id', mid.checkJWT.....`

        - import `OrderSchema`

    - open Postman + retrieve all orders from specific user

        - POST `localhost:3030/api/accounts/login` + -> `body` -> `x-www-form-urlencoded` -> add login email + password `value/keys` -> `send`

        - copy token

        - in new tab GET `localhost:3030/api/accounts/orders/`

            - go to `headers` -> add `Authorization` key + `token` value -> send

    - retrieve single order

       - in `routes/account.js`:

          - `router.get('/orders/:id' ......`

    - test in Postman

        - GET ` localhost:3030/api/accounts/orders/<id_for_specific_order> `
        -> add sign in token to `headers` via Auth -> `send`
## To Do:

    - create a reset password function with `nodemailer`


## Notes:

  - Why we chose to upload images to AWS instead of just to mLab/MongoDb:

      - AWS S3 is known for it's static files storage. you don't want to store binary data files to MongoDB because it might slow down the query searches.

      - Whenever you think of storing images, videos, PDF and so on. Use S3.


      ## Angular 6 + RxJS 6 Changes - Quick Fix

        - ` npm install --save rxjs@6 `

        - ` npm install --save rxjs-compat `

        - ` npm install -g @angular/cli@latest `//global install

        * Angular CLI V6 requires `Node V 8.9+` :

            - ` nvm install node --version 8.9 `

            - ` nvm use <node-version>`

            - ` npm install @angular/cli@latest `

            - ` ng update @angular/cli `//from within project directory

                - new `angular.json` file is generated replacing the old `.angular-cli.json`

            - now analyze existing project to check for outdated libraries:

                - ` ng update `

                - ` ng update @angular/core `

            - delete `node_modules` + `package-lock.json` file in your project and re-run `npm install` if facing issues after updating
