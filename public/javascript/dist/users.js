let usersPage = () => {
	var totalPages = document.querySelector('#userslist tbody').getAttribute('data-total');
	var currentPage = document.querySelector('#userslist tbody').getAttribute('data-current');
	$('#pagers').jqPaginator({
	  totalPages: parseInt(totalPages),
	  currentPage: parseInt(currentPage),
	  onPageChange: function (num, type) {
	  	if(type == 'change'){
	      	location.href = "/users/page?p="+num+"&limit=5";  
	  	}
	  }
	});
}