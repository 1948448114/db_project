String.prototype.replaceAll = function (exp, newStr) {
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
    if (arguments.length == 1 && typeof (args) == "object") {
        // 如果模板参数是对象
        data = args;
    }
    for ( var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replaceAll("\\{" + key + "\\}", value);
        }
    }
    return result;
}
$(function(){
	// $.ajax({
	// 	url: '/user/login',
	// 	type: 'POST',
	// 	dataType: 'json',
	// 	data: {phone: '15651918580',pwd:'084358'},
	// })
	// .done(function(data) {
	// 	console.log(data);
	// })
	// .fail(function() {
	// 	console.log("error");
	// })
	// .always(function() {
	// 	console.log("complete");
	// });
//————————————关闭登陆框————————————
	$('#close_login').click(function(event) {
		$('.login').hide('slow/400/fast');
	});
	//————————————关闭注册框————————————
	$('#close_signup').click(function(event) {
		$('.signup').hide('slow/400/fast');
	});
	//————————————关闭验证框————————————
	$('#close_verify').click(function(event) {
		$('.verify').hide('slow/400/fast');
	});
	//————————————关闭改密码框————————————
	$('#close_changePwd').click(function(event) {
		$('.changePwd').hide('slow/400/fast');
	});
	//————————————关闭登新密码————————————
	$('#close_newPwd').click(function(event) {
		$('.newPwd').hide('slow/400/fast');
	});
	//————————————导航条点击登录————————————
	$('#tologin').click(function(event) {
		$('.login').show('slow/400/fast');
	});
	//————————————导航条点击修密码————————————
	$('#tonewPwd').click(function(event) {
		$('.newPwd').show('slow/400/fast');
	});
	//————————————点击出现注册框————————————
	$('#tosignup').click(function(event) {
		$('.login').hide();
		$('.signup').show('slow/400/fast');
	});
	//————————————点击出现忘记密码————————————
	$('#toforget').click(function(event) {
		$('.login').hide();
		$('.verify').show('slow/400/fast');
	});
	//————————————点击提交验证————————————
	$('#toChangePwd').click(function(event) {
		$('.verify').hide();
		$('.changePwd').show('slow/400/fast');
	});
	//————————————显示书籍简介————————————
	$('.showInfo').click(function() {
		$('.bookInfo').toggle();});
	//————————————登录————————————
	$('#login_btn').click(function(event) {
		var phone=$('#login_phone').val();
		var pwd=$('#login_pwd').val();
		$.ajax({
			url: '/user/login',
			type: 'POST',
			dataType: 'json',
			data: {phone: phone,pwd:pwd},
		})
		.done(function() {
			console.log();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function(data) {
			console.log(data);
			$("#login_alert").show();
			if(data.code==200){
			$('#login_alert>p').html("登陆成功");
			$('#login_phone').val('');
			$('#login_pwd').val('');
				setTimeout(function(){
				$("#login_alert").hide();
				$(".login").hide();
				location.reload(); 
				},1000);
			}
			else
			$('#login_alert>p').html(data.content);
		});
		
	});
	//————————————注销————————————
	$('#logout').click(function(event) {
		$.cookie("username",null);
		location.reload(); 
	});
//————————————注册————————————
$('#signup_btn').click(function(event){
	console.log("woyaozhuce");
	var name=$('#signup_name').val();
	var pwd=$('#signup_pwd').val();
	var email=$('#signup_email').val();
	var address=$('#signup_address').val();
	var phone=$('#signup_phone').val();
	var qkey=$('#signup_select').val();
	var qvalue=$('#signup_anwer').val();
	var data = {
		'name':name,
		'pwd':pwd,
		'email':email,
		'address':address,
		'phone':phone
	}
	data[qkey] = qvalue;
	$.ajax({
		url: '/user/reg',
		type: 'POST',
		dataType: 'json',
		data: data,
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function(data) {
		$("#signup_alert").show();
		if(data.code==200){
			$('#signup_alert>p').html("注册成功");
			$('#signup_name').val('');
			$('#signup_pwd').val('');
			$('#signup_email').val('');
			$('#signup_address').val('');
			$('#signup_phone').val('');
			$('#signup_anwer').val('');
			setTimeout(function(){
				$('.signup').hide();
				// location.reload(); 
			},1000)
		}
		else
			$('#signup_alert>p').html(data.content);
		});
	});
//————————————首页书籍展示————————————
$.ajax({
	url: '/book/all',
	type: 'POST',
	dataType: 'json',
	data: {page: 1,pagesize:5},
})
.done(function(data) {
	console.log(data.content[1].picture);
	var template2="我是{name}，今年{age}了";
	var result2=template2.format({name:"loogn",age:22});
	console.log(result2);
	for(var i = 0; i<data.content.length ;i++){

	var homeTemplate='<html><head></head><body><li class="list-group-item"><div class="row"><div class="col-sm-3 bookImg"><img src="{picture}"></div><div class="col-sm-3"><div class="row">书籍名称:&nbsp;&nbsp; <span class="home_name">{name}</span></div><div class="row">&nbsp;ISBN:&nbsp;&nbsp; <span class="home_isbn">{isbn}</span></div><div class="row">上架时间:&nbsp;&nbsp; <span id="home_shelftime">{shelftime}</span></div></div><div class="col-sm-3"><div id="home_" class="row">作者:&nbsp;&nbsp; <span id="home_autor">{author}</span></div><div id="home_" class="row">出版时间:&nbsp;&nbsp; <span id="home_releasetime">{releasetime}</span></div><div class="row">销售额:&nbsp;&nbsp; <span id="home_soldnum">{soldnum}</span></div></div><div class="col-sm-3"><div class="row">余量:&nbsp;&nbsp; <span id="home_remainnum">{remainnum}</span></div><div class="row">价格:&nbsp;&nbsp; <span id="home_price">{price}</span></div><div class="row">状态:&nbsp;&nbsp; <span id="home_active">{active}</span></div><div class="row"><button class="btn btn-danger btn-sm">加入购物车</button> <button class="btn btn-warning btn-sm showInfo">查看简介</button></div></div></div><div class="row bookInfo"><h5>书籍简介:</h5><p id="home_note">{note}</p></div></li></body></html>';
	var result=homeTemplate.format({picture:data.content[i].picture,name:data.content[i].name,isbn:data.content[i].isbn,shelftime:data.content[i].shelftime,
		author:data.content[i].author,releasetime:data.content[i].releasetime,soldnum:data.content[i].soldnum,remainnum:data.content[i].remainnum,
		price:data.content[i].price,active:data.content[i].active,note:data.content[i].note});
	console.log(result);
	$('#homeBookUl').append(result);
	}
})
.fail(function() {
	console.log("error");
})
.always(function() {
	console.log("complete");
});

})

function addNum(){
	var number_temp=$('#id4').html();
	var number=parseInt(number_temp);
	$('#id4').html(++number);
}
function cutNum(){
	var number_temp=$('#id4').html();
	var number=parseInt(number_temp);
	if(number<=0){
		$('#id4').html(number);
	}
	else
	$('#id4').html(--number);
}
function deleteChart(){
	$(event.target).closest('.list-group-item').remove();
}





