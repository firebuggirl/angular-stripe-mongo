const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deepPopulate = require('mongoose-deep-populate')(mongoose);
//const mongooseAlgolia = require('mongoose-algolia');

const ProductSchema = new Schema({

  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  owner:  { type: Schema.Types.ObjectId, ref: 'User'},
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
  image: String,
  title: String,
  description: String,
  price: Number,
  created: { type: Date, default: Date.now }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

//category: { 5be1f4a2731bfe3d8ed90357 }//category id for 'technics'
ProductSchema
  .virtual('averageRating')
  .get(function() {
    var rating = 0;
    if (this.reviews.length == 0) {
      rating = 0;
    } else {
      this.reviews.map((review) => {
        rating += review.rating;
      });
      rating = rating / this.reviews.length;
    }

    return rating;
  });

ProductSchema.plugin(deepPopulate);

// ProductSchema.plugin(mongooseAlgolia, {
//   appId: '5QUDKGJ5FD',
//   apiKey: '114fa4453bba4d9f211a53ba1a986a56',
//   indexName: 'angular-stripe-mongo',
//   selector: '_id title image reviews description price owner created averageRating',
//   populate: {
//     path: 'owner reviews',
//     select: 'name rating'
//   },
//   defaults: {
//     author: 'uknown'
//   },
//   mappings: {
//     title: function(value) {
//       return `${value}`
//     }
//   },
//   virtuals: {
//     averageRating: function(doc) {
//       var rating = 0;
//     if (doc.reviews.length == 0) {
//       rating = 0;
//     } else {
//       doc.reviews.map((review) => {
//         rating += review.rating;
//       });
//       rating = rating / doc.reviews.length;
//     }
//
//     return rating;
//     }
//   },
//   debug: true //turn off if running in production
// });


// let Model =  mongoose.model('Product', ProductSchema);
// Model.SyncToAlgolia();
// Model.SetAlgoliaSettings({
//   searchableAttributes: ['title'] //title is the searchable attribute, can add more via an array ['title', 'image', ....]
// });


module.exports = mongoose.model('Product', ProductSchema);
