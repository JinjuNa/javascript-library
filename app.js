var express = require('express');
var app = express();

var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aa950307',
    database: 'library'

});

db.connect();
// mysql 관련..

app.use(express.static('public'));

// 초기화면
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// 전체 카테고리, 각 카테고리명 보여주기
app.get('/allCategory', function (req, res) {
    db.query('SELECT categoryName FROM CATEGORY', function (error, result) {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

// 카테고리 넘버별 항목의 이름, 가격 보여주기
app.get('/category/:categoryNum', function (req, res) {
    console.log(`${req.params.categoryNum}`);
    if (`${req.params.categoryNum}` === '0') {
        db.query('SELECT num, name, price FROM PRODUCT', function (error, result) {
            if (error) {
                console.log(error);
            }
            res.send(result);
        });
    } else {
        db.query(`SELECT num, name, price FROM PRODUCT WHERE CATEGORYNUM = ${req.params.categoryNum}`, function (error, result) {
            if (error) {
                console.log(error);
            }
            res.send(result);
        });
    }
});

// 각 아이템의 이름, 가격
app.get('/item/:num', function (req, res) {
    db.query(`SELECT name, detail, price, image FROM PRODUCT WHERE NUM = ${req.params.num}`, function (error, result) {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

// 검색한 키워드에 맞는 아이템들의 이름과 가격리스트
app.get('/search/:keyword', function (req, res) {
    db.query(`SELECT num, name, price FROM PRODUCT WHERE NAME LIKE '%${req.params.keyword}%'`, function (error, result) {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
