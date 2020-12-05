window.onload = () => {
    getCategoryName();
}

getCategoryName = () =>{
    ul = document.getElementById('categoryBar');
    
    fetch(`http://localhost:3000/library/getCategory`)
    .then(res => res.json())
    .then(jsonData => {     //왜 이렇게 하는거지?
        data = jsonData
        console.log(jsonData);
        data.map((item) => {
            var li = document.createElement('li');
            var text = document.createTextNode([item.name]);
            li.classList.add('categoryItem');
            li.appendChild(text);
            li.setAttribute('data-id', item.id);
            ul.appendChild(li);
        })
    })
    .then(()=> {
        const categoryTabs = document.getElementsByClassName('categoryItem');
        var cid = '';
        for(let i=0; i<5; i++){
            categoryTabs[i].addEventListener('click', (e) => {
                cid = e.target.getAttribute('data-id');
                getBookList(cid);
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
        console.log(jsonData);
        data.map((item) => {
            var li = document.createElement('li');
            var text = document.createTextNode([item.name]);
            li.classList.add('categoryItem');
            li.appendChild(text);
            li.setAttribute('data-id', item.id);
            ul.appendChild(li);
        })
    })
    .catch((error) => console.log(error))
    
}


// fetch(`http://localhost:3000/todo/delete/${id}`)
//     .then(res => res.json())
//     .then(() => {
//         getData()
//     })
//     .catch(() => alert('에러발생'))