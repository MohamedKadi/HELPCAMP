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

async function getNewPhoto() {
    let randomNumber = Math.floor(Math.random() * 10);
    return fetch('https://api.unsplash.com/search/photos?query=camping&client_id=UqZ4AsQi7KhCjTevvZS0jDsW9bjF79xRPhW4EmE-kBw')
        .then((res)=> res.json())
        .then(data => {
            let allimages = data.results[randomNumber];
            return allimages.urls.small;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

const sample =(array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const randomNum = Math.floor(Math.random()*25 + 10);
        let randomImage = await getNewPhoto();
        const c = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price: randomNum,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio debitis temporibus nesciunt, maxime delectus blanditiis neque at magnam laboriosam nostrum quibusdam iure modi soluta consectetur ab aperiam, animi asperiores non?',
            image: randomImage,
        })
        await c.save();
    }
    
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})