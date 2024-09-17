const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path =require('path');
const Campground = require('./models/campground');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/help-camp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'/views'))

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds',async(req,res)=>{
    const camps = await Campground.find({});
    console.log(camps.length);
    res.render('campgrounds/index',{camps: camps});
})

app.listen(3000, ()=>{
    console.log("3000 PORT IS LISTENING");
})