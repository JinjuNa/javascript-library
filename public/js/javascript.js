window.onload = () => {
    getCategoryName();
}

getCategoryName = () =>{
    ul = document.getElementById('categoryBar');
    
    fetch(`http://localhost:3000/library/getCategory`)
    .then(res => res.json())
    .then(jsonData => {     //왜 이렇게 하는거지?
        data = jsonData
        data.map((item) => {
            var li = document.createElement('li');
            var text = document.createTextNode([item.name]);
            li.classList.add('categoryItem');
            li.appendChild(text);
            li.setAttribute('data-cid', item.id);
            ul.appendChild(li);
        })
    })
    .then(()=> {
        const categoryTabs = document.getElementsByClassName('categoryItem');
        var cid = '';
        for(let i=0; i<5; i++){
            categoryTabs[i].addEventListener('click', (e) => {
                cid = e.target.getAttribute('data-cid');
                var siblings = e.target.parentNode.childNodes;
                for(let i=1; i<6; i++){
                    siblings[i].classList.remove('selected');
                    console.log(siblings[i]);
                }
                e.target.classList.add('selected');

                getBookList(cid);
                var bookDetail = document.getElementById('bookDetail');
                bookDetail.classList.add('disable');
            })
        }

    })
    .catch((error) => console.log(error))
}

const getBookList = (cid) => {
    fetch(`http://localhost:3000/library/getBookList/${cid}`)
    .then(res => res.json())
    .then(jsonData => {     //왜 이렇게 하는거지?
        data = jsonData
        var bookListTbody = document.getElementById('bookListTbody');
        bookListTbody.innerHTML = '';

        if(data.length == 0){
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            var noDataText = document.createTextNode('데이터가 존재하지 않습니다.');
            td.appendChild(noDataText);
            td.setAttribute('colspan', '10');
            tr.appendChild(td);
            bookListTbody.appendChild(tr);
            return false;
        }
        
        data.map((item, index) => {
            var tr = document.createElement('tr');
            var td = document.createElement('td');    
            var num = document.createTextNode([index+1]);
            var title = document.createTextNode([item.title]);
            var author = document.createTextNode([item.author]);
            var publisher = document.createTextNode([item.publisher]);

            var numTd = document.createElement('td');
            var titleTd = document.createElement('td');
            var authorTd = document.createElement('td');
            var publisherTd = document.createElement('td');
            var starTd = document.createElement('td');
            
            numTd.appendChild(num);
            titleTd.appendChild(title);
            authorTd.appendChild(author);
            publisherTd.appendChild(publisher);
            if(item.star == "Y"){
                starTd.innerHTML = '<i class="fas fa-star active"></i>';
            }else{
                starTd.innerHTML = '<i class="fas fa-star"></i>';
            }

            tr.setAttribute('data-id', item.id);
            tr.appendChild(numTd);
            tr.appendChild(titleTd);
            tr.appendChild(authorTd);
            tr.appendChild(publisherTd);
            tr.appendChild(starTd);
            bookListTbody.append(tr);
        })

    })
    .then(()=> {
        var bookListTbody = document.getElementById('bookListTbody');
        const bookTr = bookListTbody.getElementsByTagName('tr');
        var len = bookTr.length;
        var id = '';
        for(let i=0; i<len; i++){
            bookTr[i].addEventListener('click', (e) => {
                id = e.target.parentNode.getAttribute('data-id');
                getBookDetail(id);
            })
        }

    })
    .catch((error) => console.log(error))
    
}

const getBookDetail = (id) => {
    fetch(`http://localhost:3000/library/getBookDetail/${id}`)
    .then(res => res.json())
    .then(jsonData => {
        data = jsonData[0];
        var bookDetail = document.getElementById('bookDetail');
        bookDetail.classList.remove('disable');

        var bookImage = document.getElementById('bookImage');
        bookImage.src = "img/book/"+data.img;
        var bookTitle = document.getElementById('bookTitle');
        bookTitle.innerHTML = data.title;
        var category = document.getElementById('category');
        category.innerHTML = data.categoryName;
        var author = document.getElementById('author');
        author.innerHTML = data.author;
        var publisher = document.getElementById('publisher');
        publisher.innerHTML = data.publisher;
        var memo = document.getElementById('memo');
        memo.innerHTML = data.memo;
    })
    .catch((error) => console.log(error))
}

// fetch(`http://localhost:3000/todo/delete/${id}`)
//     .then(res => res.json())
//     .then(() => {
//         getData()
//     })
//     .catch(() => alert('에러발생'))