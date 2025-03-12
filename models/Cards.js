const { Schema, model } = require("mongoose");
const cardSchema = new Schema({

    
});

const Card = model("cards", cardSchema);
module.exports = Card;
