(function()
{
	var app = angular.module('preferences',[]);

	app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

	app.controller('AppController',['$http',function($http){
		this.prefered = [];
		var userName = $('#current_user').html();
		var userEmail = $('#current_user_email').html();
		//console.log(userName);
		//console.log(userEmail);
		$http({
                    method: "post",
                    url: "/get_preferences",
                    data: {
                        user: userName,
                        email: userEmail                        
                    }
                }).success(function(data){
                	this.prefered = data;
                });

	}]);

	app.controller('SearchPreferenceController',function($scope){
		$scope.apps = "";
		var userName = $('#current_user').html();
		var userEmail = $('#current_user_email').html();
		$('#query').keypress(function(){
                    var query = $("#query").val();
                    $.post("/search",{query:query}, function( data ) {
                    	$scope.apps = eval('('+data+')');
                    	//console.log($scope.apps);
                    }); 
             });

		$scope.addPreference = function(bundleId)
			{
				//alert(bundleId);

				var r = confirm("Are you sure you want to add this app ?");
				if(r==true)
				{
					//make a payload
					var data = {user:userName,email:userEmail,bundleId:bundleId};
					$.post("/add_preferences",data,function(response){

					});
				}
			};

	});



})();