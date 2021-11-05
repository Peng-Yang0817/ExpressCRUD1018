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

app.listen(port, () => {
    console.log(`The server is running => http://127.0.0.1:${port}`);
})

let mySQL = require('mysql');
const { query } = require("express");

const db = mySQL.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nodemysql'
});
db.connect(function (err) {
    if (err) {
        console.log('Connected error!! QQ');
        return console.error('error: ' + err.message);
    }
    console.log('Connected success');
});

app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
})
app.get('/createTable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT,Name VARCHAR(50),Sex VARCHAR(10), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('posts table created...');
    });
})
app.get('/addRow1', (req, res) => {
    let newRow = { Name: '阿鵬', Sex: 'M' };
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, newRow, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('New data Row1 is inserted...');
    })
})
app.get('/addRow2', (req, res) => {
    let newRow = { Name: '小惠', Sex: 'F' };
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, newRow, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('New data Row2 is inserted...');
    })
})
//取所有的值，並將內容打印在ConsoleLine上，結果都會在Results裡面，設計的時候可從Resoult著手
//Result的值會跟SQL語句有關，因為Result是SQL語句執行的結果，如果Result的值不是自己想要的
//可以再確認看看是不是SQL語句有問題
app.get('/getPostsAll', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        for (let x of results) {
            let Name = x.Name;
            let Sex = x.Sex;
            console.log(`Name:${Name},Sex:${Sex}`)
        }
        console.log(results);
        res.send('All Data is showed on consoleLine...');
    })
})
//取特定的Row
app.get('/getPost/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id =${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(`The ${req.params.id} is showed on consoleLine...`);
    })
})
//Udata資料表中的某欄位內容
app.get('/updatePostSex/:id', (req, res) => {
    let newSex = 'F'
    let sql = `UPDATE posts SET Sex = '${newSex}' WHERE id =${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(`The Sex for ${req.params.id} is Updated and Showed on consoleLine...`);
    })
})
app.get('/updatePostName/:id', (req, res) => {
    let newName = '惠鈞'
    let sql = `UPDATE posts SET Name = '${newName}' WHERE id =${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(`The Name for ${req.params.id} is Updated and Showed on consoleLine...`);
    })
})
//Delet資料表中符合條件的欄位
app.get('/deletpost/:id', (req, res) => {
    let sql = `delete from posts WHERE id = ${req.params.id};`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(`The id : ${req.params.id} form posts is deleted and Showed on consoleLine...`);
    })
})

//關閉SQL連線
//connection.destroy();
// db.end(function (err) {
//     if (err) {
//         console.log("Can't Close Connected Plz Try Again!! QQ");
//         return console.log('error:' + err.message);
//     }
//     console.log('Close the database connection.');
// });

app.get('*', (req, res) => {
    res.send('I can not find what you want -.-');
})