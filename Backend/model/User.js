const mongoose = require("mongoose");
const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  solana_wallet: {
    type: String,
  },
  score: {
    type: Number,
  },
  earn: {
    type: Number,
  },
});
module.exports = mongoose.model("user", User);
