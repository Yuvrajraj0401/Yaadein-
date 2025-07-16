const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes');
const userRouter = require('./routes/user.routes');
const connectToDB = require('./Config/db');

require('dotenv').config();
connectToDB();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter); // ✅ for home, upload, delete, download
app.use('/user', userRouter); // ✅ for login/register/logout

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
