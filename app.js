let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let memberRouter = require('./routes/members');

let app = express();

const members = require("./routes/members");

const cors = require("cors");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Our Custom Your Life Your Stories Routes
app.get('/members', members.findAll);
app.get('/members/:MemberName', members.findOne);
app.post('/members',members.addMember);
app.delete('/members/:memberId', members.deleteMember);
app.delete('/deleteVideoStory/:videoId', members.deleteVideoStory);
app.post('/members/:memberName', members.signIn);
app.post('/addNewVideoStory', members.addNewVideoStory)
app.get('/returnTokenData', members.returnTokenData)

app.get('/getVideoStories/:listOfStoryIds', members.getVideoStories)
app.get('/getVideosBasedOnSearch/:searchOptions', members.getVideosBasedOnSearch)
app.get('/getVideosBasedOnCountryLanguage/:searchOptions', members.getVideosBasedOnCountryLanguage)
app.get('/getVideosBasedOnCountryDecade/:searchOptions', members.getVideosBasedOnCountryDecade)
app.get('/getVideosBasedOnLanguageDecade/:searchOptions', members.getVideosBasedOnLanguageDecade)
app.get('/getVideosBasedOnCountry/:searchOptions', members.getVideosBasedOnCountry)
app.get('/getVideosBasedOnLanguage/:searchOptions', members.getVideosBasedOnLanguage)
app.get('/getVideosBasedOnDecade/:searchOptions', members.getVideosBasedOnDecade)







app.use('/', indexRouter);
app.use('/members', memberRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
