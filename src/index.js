const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const myStrings = require('./helpers/consoleStrings');

// Initializations
const app = express();
app.use(fileUpload({createParentPath: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs' 
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(methodOverride('_method'));

// Routes 
app.use(require('./routes/index'));
// app.use('/users/', require('./routes/users'));
// app.use('/app', require('./routes/app'));


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listennig 
app.listen(app.get('port'), () => {
    console.log(myStrings.minefier(),'Server on port:'.blue +` ${app.get('port')}`.green);
});

