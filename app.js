var cors = require('cors');
var express = require('express');
var app = express();

var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aa950307',
    database: 'library',
    port : '3307'

});

db.connect();
// mysql 관련..

app.use(express.static('public'));
app.use(cors());

// 초기화면
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// 전체 카테고리, 각 카테고리명 보여주기
app.get('/library/getCategory', function (req, res) {
    db.query('SELECT * FROM category', function (error, result) {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

// 카테고리id 별 책 리스트의 정보 보여주기
app.get('/library/getBookList/:cid', function (req, res) {
    db.query(`SELECT * FROM book WHERE cid = ${req.params.cid}`, function (error, result) {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

// 책id 별 상세정보 보여주기
app.get('/library/getBookDetail/:id', function (req, res) {
    db.query(`SELECT a.*, b.name as categoryName FROM book a JOIN category b ON a.cid = b.id WHERE a.id = ${req.params.id}`, function (error, result) {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
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
