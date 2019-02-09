const router = require('express').Router();
const Product = require('../models/product');

require('dotenv').config({ path: '../variables.env' });
const aws = require('aws-sdk');//communicate w/ AWS services
const multer = require('multer');//library to upload images
const multerS3 = require('multer-s3');//library to upload images directly to Amazon S3
const s3 = new aws.S3({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET });

const faker = require('faker');

const mid = require('../middlewares');



var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'angularstripemongoawsapplication',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {//name of uploaded file
      cb(null, Date.now().toString())
    }
  })
});

// add upload function to S3 API
router.route('/products')//find all products that belong to owner
  .get( mid.checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
      .populate('owner')//owner is referring to `User` schema
      .populate('category')
      .exec((err, products) => {//use exec when running more than one function to execute on one Mongoose operation
        if (products) {
          res.json({
            success: true,
            message: 'Products',
            products: products
          });
        }
      });
  })
  .post([ mid.checkJWT, upload.single('product_picture')], (req, res, next) => {
    console.log(upload);
    console.log(req.file);
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.location;//S3 will return an image name
    product.save();
    res.json({
      success: true,
      message: 'Successfully Added the product'
    });
  });

/* Just for testing */
// GET categoy IDs localhost:3030/api/categories/
// localhost:3030/api/seller/faker/test GET request in Postman
// Successfully added 20 pictures
// Then localhost:3030/api/seller/products GET request
router.get('/faker/test',(req, res, next) => {
  for (i = 0; i < 20; i++) {
    let product = new Product();
    product.category = '5be1f4a2731bfe3d8ed90357';
    product.owner = '5be1eb829c50d73c9a336ccb';
    product.image = faker.image.technics();
    product.title = faker.commerce.productName();
    product.description = faker.lorem.words();
    product.price = faker.commerce.price();
    product.save();
  }

  res.json({
    message: "Successfully added 20 pictures"
  });

});



module.exports = router;
