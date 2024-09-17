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
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'/views'))

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds',async(req,res)=>{
    const camps = await Campground.find({});
    res.render('campgrounds/index',{camps});
})
app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', async(req,res)=>{
    const {title, location} = req.body.campground;
    const newCampground = await Campground.create({title: title, location: location});
    res.redirect('/campgrounds/'+ newCampground._id);
})
app.get('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show',{camp});
})

app.listen(3000, ()=>{
    console.log("3000 PORT IS LISTENING");
})