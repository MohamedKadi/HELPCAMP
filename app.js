const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path =require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const AppError = require('./helpers/AppError');
const { error } = require('console');
const wrapAsync = require('./helpers/catchAsync');
const Joi = require('joi');
const campground = require('./models/campground');
//chd dkchi liwst obj
const {campgroundSchema} = require('./validateSchemas');

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

const validateCamp = (req,res,next)=>{
    //is not a schema it just to validate our data
    
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const errorMsg = error.details.map(el => el.message).join(',');
        throw new AppError(errorMsg,400);
    }
    next();
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

app.post('/campgrounds', validateCamp,wrapAsync(async(req,res,next)=>{
        // if(!req.body.campground){
        //     throw new AppError('Invalid Data or incomplete',400);
        // }
        
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

app.put('/campgrounds/:id',validateCamp, wrapAsync(async (req,res,next)=>{
        const {id} = req.params;
        const camp = await Campground.findByIdAndUpdate(id,req.body.campground, {runValidators: true, new: true});

        res.redirect('/campgrounds/'+ id);

}))
app.delete('/campgrounds/:id', wrapAsync(async (req,res,next)=>{
        const {id} = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds');  
}))

app.all('*',(req,res,next)=>{
    next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {status = 500}= err;
    if(!err.message){
        err.message = 'something is off';
    }
    res.status(status).render('error',{err});
})

app.listen(3000, ()=>{
    console.log("3000 PORT IS LISTENING");
})