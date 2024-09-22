const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path =require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./AppError');
const { error } = require('console');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/help-camp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const app = express();
app.engine('ejs', ejsMate);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'));


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'/views'))

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err => next(e));
    }
}

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds',wrapAsync(async(req,res,next)=>{
    
        const camps = await Campground.find({});
        if(!camps){
            throw new AppError('there is no camps right now', 404);
        }
        res.render('campgrounds/index',{camps});
    
}))
app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',wrapAsync(async(req,res,next)=>{
        const {title, location} = req.body.campground;
        const newCampground = await Campground.create({title: title, location: location});
        res.redirect('/campgrounds/'+ newCampground._id);
})) 
app.get('/campgrounds/:id',wrapAsync(async(req,res,next)=>{
        const {id} = req.params;
        const camp = await Campground.findById(id);
        if(!camp){
            throw new AppError('there is no such camp', 404);
        }
        res.render('campgrounds/show',{camp});
}))
app.get('/campgrounds/:id/edit',wrapAsync(async (req, res,next)=>{
        const {id} = req.params;
        const camp = await Campground.findById(id);
        if(!camp){
            throw new AppError('there is no camp with that id', 404);
        }
        res.render('campgrounds/edit',{camp});
}))

app.put('/campgrounds/:id', wrapAsync(async (req,res,next)=>{
        const {id} = req.params;
        const camp = await Campground.findByIdAndUpdate(id,req.body.campground, {runValidators: true, new: true});
        res.redirect('/campgrounds/'+ id);

}))
app.delete('/campgrounds/:id', wrapAsync(async (req,res,next)=>{
        const {id} = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');  
}))

app.use((err, req, res, next) => {
    const {status=500, message='Something is Off'}= err;
    res.status(status).send(message);
})

app.listen(3000, ()=>{
    console.log("3000 PORT IS LISTENING");
})