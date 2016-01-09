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
})
//————————————登录————————————
$('#signup_btn').click(function(event) {
	var name=$('#signup_name').val();
	var pwd=$('#signup_pwd').val();
	var email=$('#signup_email').val();
	var address=$('#signup_address').val();
	var phone=$('#signup_phone').val();
	$.ajax({
		url: '/user/reg',
		type: 'POST',
		dataType: 'json',
		data: {name: name,pwd:pwd,email:email,address:address
			,phone:phone},
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function(data) {
		if(data.code==200){
			$('#signup_alert>p').html("登陆成功");
			$('#signup_name').val('');
			$('#signup_pwd').val('');
			$('#signup_email').val('');
			$('#signup_address').val('');
			$('#signup_phone').val('');
			setTimeout(function(){
				$('.signup').hide();
				location.reload(); 
			},1000)
		}
		else

	});
	
});
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





