const express = require('express');
const helmet = require('helmet');//initiate security headers
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './variables.env' });


const app = express();

// Only include useMongoClient only if your mongoose version is < 5.0.0
//mongoose.connect(process.env.LOCAL_DB, {useMongoClient: true}, err => {
mongoose.connect(process.env.DATABASE, {useMongoClient: true}, err => {
  if (err) {
    console.log(err);
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoutes);

//app.use(helmet());//get security report here: https://securityheaders.io/
app.use(helmet({
  frameguard: {//disable X-Frame-Options which allow you to control whether the page can be loaded in a frame like <frame/> <iframe/> or <object/>
    action: 'deny'
  }
}));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.contentSecurityPolicy({//protect against malicious injection of JavaScript, CSS, plugins....
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}));



app.set('port', process.env.PORT || 3030);
//app.set('port', process.env.PORT || 4200);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
