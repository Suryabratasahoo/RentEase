const mongoose=require("mongoose");
const initData=require("./data.js");

const listing=require("../models/listing.js");
main().then(()=>{
    console.log("connected to database")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'66d45460492312732f7543e6'}));
    await listing.insertMany(initData.data);
    console.log("data entered");
}

initDb();
