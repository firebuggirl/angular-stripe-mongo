const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')(process.env.STRIPE_TEST_API_KEY);

const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');
const Order = require('../models/order');


const mid = require('../middlewares');


//Postman Get test
// localhost:3030/api/products
router.get('/products', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel([
    function(callback) {
      Product.count({}, (err, count) => {
        var totalProducts = count;
        callback(err, totalProducts);
      });
    },
    function(callback) {
      Product.find({})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if(err) return next(err);
          callback(err, products);
        });
    }
  ], function(err, results) {
    var totalProducts = results[0];
    var products = results[1];

    res.json({
      success: true,
      message: 'category',
      products: products,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    });
  });

});

router.route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Success",
        categories: categories
      })
    })
  })
  .post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Successful"
    });
  });

//test in Postman: localhost:3030/api/categories
// localhost:3030/api/categories/5aea2b132abd041a7a9e8aa1
router.get('/categories/:id', (req, res, next) => {
    const perPage = 10;
    const page = req.query.page;
    async.parallel([//run all Mongoose operations at one time
      function(callback) {
        Product.count({ category: req.params.id }, (err, count) => {
          var totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(callback) {
        Product.find({ category: req.params.id })
          .skip(perPage * page)
          .limit(perPage)
          .populate('category')
          .populate('owner')
          .populate('reviews')
          .exec((err, products) => {
            if(err) return next(err);
            callback(err, products);
          });
      },
      function(callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
         callback(err, category)
        });
      }
    ], function(err, results) {
      var totalProducts = results[0];
      var products = results[1];
      var category = results[2];
      res.json({
        success: true,
        message: 'category',
        products: products,
        categoryName: category.name,
        totalProducts: totalProducts,
        pages: Math.ceil(totalProducts / perPage)
      });
    });

  });


//Postman GET test:
// localhost:3030/api/product/5aea32b76cd7621c8e9b7970
  router.get('/product/:id', (req, res, next) => {
      Product.findById({ _id: req.params.id })
        .populate('category')
        .populate('owner')
        .deepPopulate(['reviews.owner','owner','reviews.title', 'reviews.description'])
        .exec((err, product) => {
          if (err) {
            res.json({
              success: false,
              message: 'Product is not found'
            });
          } else {
            if (product) {
              res.json({
                success: true,
                product: product

              });
              console.log(product);
            }
          }
        });
    });

//Add review via Postman to test
//in Postman GET localhost:3030/api/categories, then
// localhost:3030/api/categories/5aea2b132abd041a7a9e8aa1
// grab product ID + open new tab GET localhost:3030/api/product/5aea2c012abd041a7a9e8aa2
// then in another tab POST localhost:3030/api/accounts/login ...sign in ....make sure the x-www-form-urlencoded is checked in
// Postman
// Grab/copy returned token
// POST localhost:3030/api/review + add Header `Authorization` with returned token from sign in as value
//in body section add: title, description, rating, productId with values + send

  router.post('/review', mid.checkJWT, (req, res, next) => {
    async.waterfall([
      function(callback) {
        Product.findOne({ _id: req.body.productId}, (err, product) => {
          if (product) {
            callback(err, product);
          }
        });
      },
      function(product) {
        let review = new Review();
        review.owner = req.decoded.user._id;

        if (req.body.title) review.title = req.body.title;
        if (req.body.description) review.description = req.body.description
        review.rating = req.body.rating;

        product.reviews.push(review._id);
        product.save();
        review.save();
        res.json({
          success: true,
          message: "Successfully added the review"
        });
      }
    ]);
  });


  router.post('/payment', mid.checkJWT, (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const currentCharges = Math.round(req.body.totalPrice * 100);

    stripe.customers
      .create({
        source: stripeToken.id
      })
      .then(function(customer) {
        return stripe.charges.create({
          amount: currentCharges,
          currency: 'usd',
          customer: customer.id
        });
      })
      .then(function(charge) {
        const products = req.body.products;

        let order = new Order();
        order.owner = req.decoded.user._id;
        order.totalPrice = currentCharges;

        products.map(product => {
          order.products.push({
            product: product.product,
            quantity: product.quantity
          });
        });

        order.save();
        res.json({
          success: true,
          message: "Successfully made a payment"
        });
      });
  });

module.exports = router;
