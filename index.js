const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const { report } = require("process");
const { v4: uuid } = require('uuid');
//methodOverride這必須用npm來安裝，這可以覆蓋調表單的請求方法
const methodOverride = require('method-override');
let comments = [
    {
        id: uuid(),
        username: 'Todd',
        comment: 'lol that is so funny'
    },
    {
        id: uuid(),
        username: 'Skyler',
        comment: 'I Like to go birdwatching with my dog'
    },
    {
        id: uuid(),
        username: 'SkBerBoi',
        comment: 'Plz delete your account , Todd'
    },
    {
        id: uuid(),
        username: 'onlysatswoof',
        comment: 'woof~woof~woof'
    },

]
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'))//這是定義要使用override時，需要呼叫_method，這可以隨便取
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.get('/comments', (req, res) => {
    res.render('comments/index', { comments })
})
//建立get與Post路由，在填表時用get方式給予表格，在發送時使用Post
app.get('/comments/new', (req, res) => {
    res.render('comments/new')
})
app.post('/comments', (req, res) => {
    const { username, comment } = req.body;
    comments.push({ id: uuid(), username, comment });
    //redirect如果沒指定HTTP的動詞，那預設會是Get
    //這裡重新定向會直接定向到上面Get的comments
    res.redirect('/comments');
})
app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/show', { comment });
})
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render('comments/edit', { comment });
})
app.patch('/comments/:id', (req, res) => {
    const { id } = req.params;
    //對網址傳回來的comment做存取
    const newComment = req.body.comment;
    //找到對應ip的記憶體位置
    const foundComment = comments.find(c => c.id === id);
    //更動記憶體位置中的comment值
    foundComment.comment = newComment;
    res.redirect('/comments')
})
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    comments = comments.filter(com => com.id !== id);
    res.redirect('/comments');
})
app.get('/', (req, res) => {
    res.render('comments/homepage')
})

//use 就是該路徑被出發會就會執行的內容，記得後面要給予next不然網頁會卡在這
app.use('/Chicken', (req, res, next) => {
    console.log('someone here!')
    next()
})
app.get('/Chicken', (req, res) => {
    res.send('Hi There~!!');
})
app.post('/Chicken', (req, res) => {
    const { FirstName, LastName } = req.body;
    res.send(`Ok~!FirstName ${FirstName} and LastName ${LastName}`);
})
app.get('*', (req, res) => {
    res.send('I can not find what you want -.-');
})
app.listen(port, () => {
    console.log(`The server is running => http://127.0.0.1:${port}`);
})

let mySQL = require('mysql');

let connection = mySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'connectlearn'
});
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});

//connection.destroy();
connection.end(function (err) {
    if (err) {
        return console.log('error:' + err.message);
    }
    console.log('Close the database connection.');
});

