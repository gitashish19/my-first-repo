const express = require("express");//requiring of express
const app = express();//installing a app
const mongoose = require("mongoose");//requiring mongoose
const Listing = require("./models/listing.js");//requir
const path = require("path");//require path for connection between html/cse folder to javascript
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";//creating a database name wanderlust and saving a mongo_url
const methodOverride = require("method-override");//requiring methode-override for put and delete operation
const ejsMate = require("ejs-mate");//requiring ejs-mate for showing same things on every page



//connection to databases
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log("err is :" , err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.path("view engine" , "ejs");
app.path("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//INDEX ROUTE
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
//new route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
});
//Show Route
app.get("/listings/:id" , async (req,res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs",{listing});
});
//create route
app.post("/listings" , async (req,res)=>{
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }
     catch (error) {
        console.log("err is : ", error);
    };
});
//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});
//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
});
app.get("/",(req,res)=>{
    res.send("HI I AM ROOT");//response if a get request on home page
});
// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//       title : "My New Villa",
//       description:"By the beach",
//       price:1200,
//       location:"Calangute,Goa",
//       country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


app.listen(8080,()=>{
    console.log("server is listening at 8080");//initializing the server
});