const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({ //Schema: fonction mise à disposition par mongoose
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes : {type: Number, default: 0},
	dislikes : {type: Number, default: 0},
	usersLiked : {type: [String], default: []},
	usersDisliked : {type: [String], default: []}
}, {autoIndex: false});

module.exports = mongoose.model('Sauce', sauceSchema);