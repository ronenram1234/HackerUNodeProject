const { Schema, model } = require("mongoose");

const cardSchema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String , required: true},
    description: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [/^05[0-9]-\d{7}$/, 'Please enter a valid Israeli phone number']
    },
    email: {
      type: String,
      required: true

    },
    web: { type: String,  required: true},
    image: {
      url: { type: String,default:"" },
      alt: { type: String,default:"" }
    },
    address: {
      state: { type: String, default: "" },
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: Number, required: true },
      zip: { type: String }
    },
    bizNumber: { type: Number,  required: true },
    likes: [{ type: Schema.Types.ObjectId }], // Array of user IDs who liked the card

    createdAt: { type: Date, default: Date.now, immutable: true }
  });

const Card = model("cards", cardSchema);
module.exports = Card;
