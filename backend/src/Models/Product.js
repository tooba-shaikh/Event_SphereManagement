var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
    productname:String,
    price:Number,
    image:String,
    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }

});
module.exports = mongoose.model('Product', productSchema);