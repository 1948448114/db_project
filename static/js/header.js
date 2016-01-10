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
//————————————页面一加载就执行————————————
$(function(){
		//————————————关闭登陆框————————————
		$('#close_login').click(function(event) {
			$('.login').fadeOut('slow/400/fast');
		});
		//————————————关闭注册框————————————
		$('#close_signup').click(function(event) {
			$('.signup').fadeOut('slow/400/fast');
		});
		//————————————关闭验证框————————————
		$('#close_verify').click(function(event) {
			$('.verify').fadeOut('slow/400/fast');
		});
		//————————————关闭改密码框————————————
		$('#close_changePwd').click(function(event) {
			$('.changePwd').fadeOut('slow/400/fast');
		});
		//————————————关闭登新密码————————————
		$('#close_newPwd').click(function(event) {
			$('.newPwd').fadeOut('slow/400/fast');
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
			$('.login').fadeOut();
			$('.signup').show('slow/400/fast');
		});
		//————————————点击出现忘记密码————————————
		$('#toforget').click(function(event) {
			$('.login').fadeOut();
			$('.verify').show('slow/400/fast');
		});
		//————————————点击提交验证————————————
		$('#toChangePwd').click(function(event) {
			$('.verify').fadeOut();
			$('.changePwd').show('slow/400/fast');
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
							$("#login_alert").fadeOut();
							$(".login").fadeOut();
							n.reload(locatio);
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
							$('.signup').fadeOut();
							location.reload();
						}, 1000)
					} else
						$('#signup_alert>p').html(data.content);
				});
		});
})