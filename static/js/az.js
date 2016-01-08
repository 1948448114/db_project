$(function(){
	// $.ajax({
	// 	url: '/login',
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
	
//关闭登陆框
$('#close_login').click(function(event) {
	$('.login').hide('slow/400/fast');
});
//导航条点击登录
$('#tologin').click(function(event) {
	$('.login').show('slow/400/fast');
});
//点击出现注册框
$('#tosignup').click(function(event) {
	$('.login').hide();
	$('.signup').show('slow/400/fast');
});
//关闭注册框
$('#close_signup').click(function(event) {
	$('.signup').hide('slow/400/fast');
});
})