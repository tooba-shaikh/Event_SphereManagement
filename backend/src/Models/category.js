var mongoose = require('mongoose');
var categorySchema = new mongoose.Schema({
    categoryname:String,
});
module.exports = mongoose.model('Category', categorySchema);