window.onload = function () {
    hideOrder();
    // getCategory 함수사용
    getCategory();

    $(document).on('click', '#category li', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var categoryidx = $('#category li.active').index();
        // console.log(categoryidx);
        $.ajax({
            url: 'http://localhost:3000/category/' + categoryidx,
            dataType: 'json',
            type: 'GET',
            success: function (result) {
                console.log(result);
                itemNameList(result);
            }
        });
    });

    $(document).on('click', '#itemtbody tr', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var itemidx = $(this).attr('data-id');
        $('.shoppingicon').show();
        $.ajax({
            url: 'http://localhost:3000/item/' + itemidx,
            dataType: 'json',
            type: 'GET',
            success: function (result) {
                console.log(result);
                itemContent(result);
            }
        });
    });

    $(document).on('click', '#shoppingbutton', function () {
        showOrder();
        var tr = $('#itemtbody tr.active');
        var orderidx = tr.attr('data-id');
        var name = tr.children('td').eq(0).text();
        var price = tr.children('td').eq(1).text();
        var item = {
            id: orderidx,
            name: name,
            price: price
        };
        addValue(item);
        updateAmount();
    });

    $(document).on('change', 'select', function () {
        updateAmount();
    });

    $(document).on('click', '.delete', function () {
        var deleteidx = $(this).parent('tr').index();
        deleteOrder(deleteidx);
        updateAmount();
    });

    $('input[type=radio][name=payment]').change(function () {
        if (this.value === '현금') {
            $('#paymentdiv').show();
            $('#paymoney').focus();
        } else if (this.value === '카드') {
            $('#paymentdiv').hide();
        }
    });

    $('#orderbutton').click(function () {
        // 현금.카드 중에 체크된 박스의 value를 가져고오고 싶다.
        var paycheckbox = document.getElementsByName('payment');
        var paymoney = document.getElementById('paymoney').value;
        var FinalPrice = document.getElementById('totalPrice').innerHTML;
        var retrunmoney = paymoney - FinalPrice;
        var orderlistId = document.getElementById('orderlistTbody');
        var len = $('#orderlistTbody tr').length;
        var orderlist = '';
        for (var i = 0; i < len; i++) {
            var orderlistIdtr = orderlistId.getElementsByTagName('tr')[i];
            var orderlistname = orderlistIdtr.getElementsByTagName('td')[0].innerHTML;
            var orderlistvalue = orderlistIdtr.getElementsByTagName('select')[0].value;
            var order = orderlistname + ' ' + orderlistvalue;
            orderlist += order;
        };

        if (paycheckbox[0].checked == true) {
            if (confirm('주문하신 내역은\n' + orderlist + '입니다.') == true) {
                alert('주문이 완료되었습니다');
            } else {
                alert('주문이 취소되었습니다');
            }
        } else {
            if (paymoney < FinalPrice) {
                alert('지불금액이 주문금액보다 작습니다. 다시 입력해주세요.');
            } else {
                if (confirm('주문하신 내역은\n' + orderlist + '입니다.\n 거스름돈은' + retrunmoney + '원 입니다.') === true) {
                    alert('주문이 완료되었습니다');
                } else {
                    alert('주문이 취소되었습니다');
                }
            }
        }
    });

    $('#closebutton').click(function () {
        hideOrder();
    });

    $('#searchicon').click(function () {
        $('#category li').removeClass('active');
        $('#category li').eq(0).addClass('active');
        var searchInput = $('#searchInput').val();
        $.ajax({
            url: 'http://localhost:3000/search/' + searchInput,
            dataType: 'json',
            type: 'GET',
            success: function (result) {
                itemNameList(result);
            }
        });
    });
};

// 라면류 보이기
function itemNameList (a) {
    var itemList = '';
    for (var i = 0; i < a.length; i++) {
        itemList += '<tr data-id=' + a[i].num + '><td>' + a[i].name + '</td><td>' + a[i].price + '</td></tr>';
    }
    document.getElementById('itemtbody').innerHTML = itemList;
};

// itemContent 보이기
function itemContent (a) {
    var image = '<img src="./img/item/' + a[0].image + '">';
    var name = a[0].name;
    var detail = a[0].detail;
    var price = a[0].price;
    document.getElementById('itemimage').innerHTML = image;
    document.getElementById('itemContentName').innerHTML = name;
    document.getElementById('itemContentDetail').innerHTML = detail;
    document.getElementById('itemContentPrice').innerHTML = price + '원';
};

// getCategory 함수정의
function getCategory () {
    $.ajax({
        url: 'http://localhost:3000/allcategory',
        dataType: 'json',
        type: 'GET',
        success: function (result) {
            var show = '<li><a href="#">전체메뉴</a></li>';
            for (var i = 0; i < result.length; i++) {
                show += '<li><a href="#">' + result[i].categoryName + '</a></li>';
            }
            document.getElementById('category').innerHTML = show;
        }
    });
};

// 주문 추가 했을시, 새로운 항목 추가 함수
function addOrder (item) {
    var orderlistTbody = document.getElementById('orderlistTbody');

    var newName = document.createTextNode(item.name);
    var newPrice = document.createTextNode(item.price);
    var selectBox = '<select name="amount"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select>';
    var deleteIcon = '<a href="#"><i class="fas fa-trash-alt"></i></a>';

    var newTr = document.createElement('tr');
    var newTdName = document.createElement('td');
    var newTdPrice = document.createElement('td');
    var newTdSelect = document.createElement('td');
    var newTdDelete = document.createElement('td');
    newTdDelete.classList.add('delete');

    newTr.setAttribute('data-id'    , item.id);
    newTdName.appendChild(newName);
    newTdPrice.appendChild(newPrice);
    newTdSelect.innerHTML = selectBox;
    newTdDelete.innerHTML = deleteIcon;

    newTr.appendChild(newTdName);
    newTr.appendChild(newTdPrice);
    newTr.appendChild(newTdSelect);
    newTr.appendChild(newTdDelete);

    orderlistTbody.appendChild(newTr);
}

// 주문목록추가했을때 이미 존재하면, value추가, 없으면 새로운 항목추가
function addValue (item) {
    if ($('#orderlistTbody [data-id=' + item.id + ']').length == 0) {
        addOrder(item);
    } else {
        var value = Number($('[data-id=' + item.id + '] select').val());
        if (value === 10) {
            alert('최대 주문 수량을 초과하였습니다.');
        } else {
            $('[data-id=' + item.id + '] select').val(value + 1);
        }
    }
}

// 주문 수량변화에 따라서, 가격을 업데이트 해주는 함수
function updateAmount () {
    var NewTotalPrice = 0;
    var len = $('#orderlistTbody tr').length;
    var orderlistTbody = document.getElementById('orderlistTbody');
    for (var i = 0; i < len; i++) {
        var selectTr = orderlistTbody.getElementsByTagName('tr')[i];
        var p = selectTr.getElementsByTagName('td')[1].innerHTML;
        var v = selectTr.getElementsByTagName('select')[0].value;
        NewTotalPrice += p * v;
    }
    document.getElementById('totalPrice').innerHTML = NewTotalPrice;
}

// 주문삭제 아이콘 클릭했을때, 주문목록에서 주문항목 사라지는 함수
function deleteOrder (a) {
    var orderlistTbody = document.getElementById('orderlistTbody');
    orderlistTbody.removeChild(orderlistTbody.childNodes[a]);
};

// 닫기를 눌렀을때, 주문목록 사라지는 함수
function hideOrder () {
    $('.box2').hide();
    $('.box1').css('width', '100%');
}

// 장바구니버튼을 눌렀을때 다시 주문목록이 생기는 함수
function showOrder () {
    $('.box2').show();
    $('.box1').css('width', '70%');
}
