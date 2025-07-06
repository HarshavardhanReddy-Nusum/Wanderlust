const mongoose = require('mongoose');
const { listingSchema } = require('../schema');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: String
    },
    // image: {
    //     type: String,
    //     default: "https://media.istockphoto.com/id/1002377768/photo/harvesting-a-wheat-field-dust-clouds.jpg?s=1024x1024&w=is&k=20&c=KIjiZ8MqljwHh_x61cjsJaAcLVAxk1mAsQJ9sqkw-MM=",
    //     set: (v) => v === "" ? "https://media.istockphoto.com/id/1002377768/photo/harvesting-a-wheat-field-dust-clouds.jpg?s=1024x1024&w=is&k=20&c=KIjiZ8MqljwHh_x61cjsJaAcLVAxk1mAsQJ9sqkw-MM=" : v,
    // },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
})

ListingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;