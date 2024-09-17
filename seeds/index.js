const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
    console.log("MONGODB Connected");
  await mongoose.connect('mongodb://127.0.0.1:27017/help-camp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample =(array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const c = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await c.save();
    }
    
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})