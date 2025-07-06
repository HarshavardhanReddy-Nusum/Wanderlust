const Listing = require("../models/listing");

const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    // console.log(allListings);
}

const newlisting = (req, res) => {
    res.render("listings/new.ejs");
}

const show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist.");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}

const create = async (req, res, next) => {
    // let {title , description,image,price,location,country} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created.");
    res.redirect("/listings");
}

const edit = async (req, res) => {
    let { id } = req.params;
    let editList = await Listing.findById(id);
    if(!editList) {
        req.flash("error","Listing you requested for does not exist.");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { editList });
}

const update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

const deletelisting = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted.");
    res.redirect("/listings");
}

module.exports = { index, newlisting, show, create, edit, update, deletelisting };
