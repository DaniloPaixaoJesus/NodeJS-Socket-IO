function getUrl(){	
	var url = window.location.href;	
	var arr = url.split("//");
	var port = '';	
	if(location.port != ''){
		port = ':' + location.port;
	}
	var str_url = arr[0] + '//' + location.hostname + port;
	//alert(str_url);
	return 'http://localhost:3000'; //str_url;
}