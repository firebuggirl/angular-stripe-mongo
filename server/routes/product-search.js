const router = require('express').Router();
require('dotenv').config({ path: '../variables.env' });

//const algoliasearch = require('algoliasearch');
//const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
//const index = client.initIndex('angular-stripe-mongo');



// router.get('/', (req, res, next) => {
//   if (req.query.query) {
//     index.search({
//       query: req.query.query,
//       page: req.query.page,
//     }, (err, content) => {
//       res.json({
//         success: true,
//         message: "Here is your search",
//         status: 200,
//         content: content,
//         search_result: req.query.query
//       });
//     });
//   }
// });


module.exports = router;
