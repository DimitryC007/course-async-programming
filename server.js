/*
    Full Name: Dmitry Chernyak, ID: 307694745
    Full Name: Ron Gorlik, ID: 206517344
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/CaloriesManager', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    id: String,
    first_name: String,
    last_name: String,
    birthday: Date
});

const calorieSchema = new mongoose.Schema({
    user_id: String,
    year: Number,
    month: Number,
    day: Number,
    id: String,
    description: String,
    category: String,
    amount: Number
});

const User = mongoose.model('User', userSchema);
const Calorie = mongoose.model('Calorie', calorieSchema);

// Initial user
const initialUser = new User({
    id: '123123',
    first_name: 'moshe',
    last_name: 'israeli',
    birthday: new Date('1990-01-10')
});
initialUser.save();

// Add calories for particular user
app.post('/addcalories', async (req, res) => {
    const { user_id, year, month, day, description, category, amount } = req.body;
    const id = new mongoose.Types.ObjectId();
    const calorie = new Calorie({ user_id, year, month, day, id, description, category, amount });
    await calorie.save();
    res.send('Calorie added');
});

// Get the specific user
app.get('/users/:id', async (req, res) => {
    const user = await User.findOne({ id: req.params.id });
    res.json(user);
});

// Get calories report for the particular user in the specific month
app.get('/report', async (req, res) => {
    const { user_id, year, month } = req.query;
    const report = { breakfast: [], lunch: [], dinner: [], other: [] };
    const calories = await Calorie.find({ user_id, year, month });
    // adding calories to report by category
    calories.forEach(cal => {
        report[cal.category].push({ day: cal.day, description: cal.description, amount: cal.amount });
    });
    res.json(report);
});

// Get info who worked on the project
app.get('/about', (req, res) => {
    res.json([
        { firstname: "Dmitry", lastname: "Chernyak", id: 307694745, email: "dimitryc007@gmail.com" },
        { firstname: "Ron", lastname: "Gorlik", id: 206517344, email: "ron.gorlik@gmail.com" }
    ]);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
