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
var currentpage = 1;
var constant_homeTemplate = '';
var global_pagesize = 1;
//————————————发送看书的请求————————————
function getbookInfo() {
	$.ajax({
			url: '/book/all',
			type: 'POST',
			dataType: 'json',
			data: {
				pagenumber: currentpage,
				pagesize: 5
			},
		})
		.done(function(data) {
			global_pagesize = data.number;
			var result = "";
			var homeTemplate = constant_homeTemplate;
			for (var i = 0; i < data.content.length; i++) {
				result += homeTemplate.format({
					picture: data.content[i].picture,
					name: data.content[i].name,
					isbn: data.content[i].isbn,
					shelftime: data.content[i].shelftime,
					author: data.content[i].author,
					releasetime: data.content[i].releasetime,
					soldnum: data.content[i].soldnum,
					remainnum: data.content[i].remainnum,
					price: data.content[i].price,
					active: data.content[i].active,
					note: data.content[i].note
				});
			}
			$('#homeBookUl').html(result);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}
//————————————页面一加载就执行————————————
$(function() {
	constant_homeTemplate = $('#book-item-temp').html();
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
		$('.bookInfo').toggle();
	});
	//————————————登录————————————
	$('#login_btn').click(function(event) {
		var phone = $('#login_phone').val();
		var pwd = $('#login_pwd').val();
		$.ajax({
				url: '/user/login',
				type: 'POST',
				dataType: 'json',
				data: {
					phone: phone,
					pwd: pwd
				},
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
				if (data.code == 200) {
					$('#login_alert>p').html("登陆成功");
					$('#login_phone').val('');
					$('#login_pwd').val('');
					setTimeout(function() {
						$("#login_alert").hide();
						$(".login").hide();
						location.reload();
					}, 1000);
				} else
					$('#login_alert>p').html(data.content);
			});

	});
	//————————————注销————————————
	$('#logout').click(function(event) {
		$.cookie("username", null);
		location.reload();
	});
	//————————————注册————————————
	$('#signup_btn').click(function(event) {
		console.log("woyaozhuce");
		var name = $('#signup_name').val();
		var pwd = $('#signup_pwd').val();
		var email = $('#signup_email').val();
		var address = $('#signup_address').val();
		var phone = $('#signup_phone').val();
		var qkey = $('#signup_select').val();
		var qvalue = $('#signup_anwer').val();
		var data = {
			'name': name,
			'pwd': pwd,
			'email': email,
			'address': address,
			'phone': phone
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
				if (data.code == 200) {
					$('#signup_alert>p').html("注册成功");
					$('#signup_name').val('');
					$('#signup_pwd').val('');
					$('#signup_email').val('');
					$('#signup_address').val('');
					$('#signup_phone').val('');
					$('#signup_anwer').val('');
					setTimeout(function() {
						$('.signup').hide();
						// location.reload(); 
					}, 1000)
				} else
					$('#signup_alert>p').html(data.content);
			});
	});
	//————————————首页书籍展示————————————
	getbookInfo();

})
//————————————下一页————————————
function nextp() {
	currentpage++;
	if (currentpage * 5 > global_pagesize) {
		$('#home_alert').show();
		$('#home_alert>p').html("已经为最后一页...别戳了");
	} else {
		console.log(currentpage);
		getbookInfo();
	}
}
//显示书籍详情
function showInfo() {
	$(event.target).closest('.list-group-item').find('.bookInfo').toggle();
}
//增加购买数量
function addNum() {
	var number_temp = $('#id4').html();
	var number = parseInt(number_temp);
	$('#id4').html(++number);
}
//减少购买数量
function cutNum() {
	var number_temp = $('#id4').html();
	var number = parseInt(number_temp);
	if (number <= 0) {
		$('#id4').html(number);
	} else
		$('#id4').html(--number);
}
//清空购物出
function deleteChart() {
	$(event.target).closest('.list-group-item').remove();
}