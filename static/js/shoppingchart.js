var constant_chartTemplate = '';
var s_isbn_array=[]
var number; //设置初值为1
var temp_books;
var result; //购物车，模板
var resultO; //确认的购物车信息，模板
var result1; //确认的用户信息，模板
var aprice;
var mydata = []; //为了确认订单（展示）
var current; //当前购物车对象
var currentp; //当前总价
var currentnum; //当前购买数量
var constant_userInfoTemplate = '';

String.prototype.replaceAll = function(exp, newStr) {
	return this.replace(new RegExp(exp, "gm"), newStr);
};
/**
 * 原型：字符串格式化
 * @param args 格式化参数值
 */
String.prototype.format = function(args) {
		var result = this;
		if (arguments.length < 1) {
			return result;
		}
		var data = arguments; // 如果模板参数是数组
		if (arguments.length == 1 && typeof(args) == "object") {
			// 如果模板参数是对象
			data = args;
		}
		for (var key in data) {
			var value = data[key];
			if (undefined != value) {
				result = result.replaceAll("\\{" + key + "\\}", value);
			}
		}
		return result;
	}
	//增加购买数量
function addNum() {
	var number_temp = $('#abooknumber').html();
	var number = parseInt(number_temp);
	$('#abooknumber').html(++number);
	$('#allprice').html(parseInt(number * aprice));
}
//减少购买数量
function cutNum() {
	var number_temp = $('#abooknumber').html();
	var number = parseInt(number_temp);
	if (number <= 0) {
		$('#abooknumber').html(number);
	} else
		$('#abooknumber').html(--number);
	$('#allprice').html(parseInt(number * aprice));
}
//删除购物车中书籍
function deleteChart() {
	$(event.target).closest('.list-group-item').remove();
	s_isbn_array.pop($(event.target).closest('.list-group-item').attr('isbn'));
	$.cookie("shoppingChart", s_isbn_array);
	if (s_isbn_array.length == 0) {
		$('#blank').html("当前购物车为空，快去选购商品吧~");
	}
}
//生成订单
function createOrder() {
	$.ajax({
			url: '/order/new',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: current.isbn,
				ordernum: currentnum,
				price: currentp
			},
		})
		.done(function(data) {
			console.log(data);
			if(data.code==200){
				s_isbn_array.pop(current.isbn);
				$.cookie("shoppingChart", s_isbn_array);
				$('#createOrder_alert>span').html("下单成功");
				$('#createOrder_alert').show();
				setTimeout(function() {
					$('#createOrder_alert').fadeOut();
					$('#createOrder_alert>span').html("");
					$('#confirmOrder').hide();
					$('#chartUl>li').html('');
					$('#blank').html("当前购物车为空，快去选购商品吧~")
					$('#shoppingchart').show();
				}, 2000000);
			}
			else{
				$('#createOrder_alert>span').html(data.content);
				$('#createOrder_alert').show();
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

}
//发送ajax请求，拿到购物车数据
function ajaxGetbooks(s_isbn) {
	$.ajax({
			url: '/book/find',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: s_isbn
			}
		})
		.done(function(data) {
			mydata.push(data.content);
			aprice = data.content[0].price;
			console.log(data);
			result = constant_chartTemplate.format({
				isbn: data.content[0].isbn,
				name: data.content[0].name,
				author: data.content[0].author,
				remainnum: data.content[0].remainnum,
				picture: data.content[0].picture,
				price: data.content[0].price,
				fprice: parseInt(data.content[0].price) * number
			})
			$('#chartUl').append(result);
			// console.log(result);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {

		});
}
//点击去下单，生成确认
function toOrder() {
	$('#shoppingchart').hide();
	var isbn = $(event.target).closest('.list-group-item').attr('isbn');
	for (var i = 0; i < mydata.length; i++) {
		if (isbn == mydata[i][0].isbn)
			current = mydata[i][0];
		// console.log(isbn+"nnn"+mydata[i]);
		// console.log(mydata[i])
	}
	console.log(current);
	currentnum = parseInt($(event.target).closest('.list-group-item').find('#abooknumber').html());
	currentp = parseInt($(event.target).closest('.list-group-item').find('#allprice').html());
	resultO = constant_confirmTemplate.format({
		name: current.name,
		picture: current.picture,
		author: current.author,
		remainnum: current.remainnum,
		price: current.price,
		wantnum: currentnum,
		fprice: currentp
	});
	$('#confirmUl').html(resultO);
	var username, phone, address;
	//获取用户信息的ajax
	$.ajax({
			url: '/user/find',
			type: 'POST',
			dataType: 'json',
			data: {},
		})
		.done(function(data) {
			console.log("success");
			username = data.content.name;
			phone = data.content.phone;
			address = data.content.address;
			console.log(username);
			result1 = constant_userInfoTemplate.format({
				wantnum: currentnum,
				fprice: currentp,
				username: username,
				phone: phone,
				address: address
			})
			$('#infoContent').html(result1);

		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	console.log('result1' + result1)
	$('#infoContent').html(result1);
	$('#confirmOrder').show();
}
//————————————页面一加载就执行————————————
$(function() {
	//与购物车展示有关的赋值
	temp_books = $.cookie("shoppingChart");
	console.log(temp_books)
	constant_chartTemplate = $('#chartTemplate').html();
	result = '';
	number = 1;
	//————————————展示购物车中商品————————————
	if (temp_books.length >= 1) {
		s_isbn_array = temp_books.split(',');
		for (var i = 0; i < s_isbn_array.length; i++) {
			ajaxGetbooks(s_isbn_array[i]);
		}
	} else {
		$('#blank').html("当前购物车为空，快去选购商品吧~")
	}
	constant_confirmTemplate = $('#confirmTemplate').html();
	constant_userInfoTemplate = $('#userInfoTemplate').html();
	console.log(constant_userInfoTemplate);
})