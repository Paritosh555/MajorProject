const mongoose = require("mongoose");
const data = require("./app.js");
const Listing = require("../models/listing.js");

try{
    main()
    .then(()=>{
                console.log("connection successfully");
     });
}
catch(err)
{
    console.log(err);
};

async function main() {

  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

};

const datainit = async()=>{

    //   await  Listing.deleteMany({});
     await  Listing.insertMany(alldata.data);
      console.log("inserted");

}

datainit();