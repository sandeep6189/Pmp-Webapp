(function()
{
	/*$(function()
        {
           $('#preferred_apps').jScrollPane(); 
           $('#cus_scroll').jScrollPane(); 
        });
	*/
	var app = angular.module('preferences',[]);

	app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

	app.controller('AppController',['$http','$scope',function($http,$scope){
		$scope.prefered = [];
		var userName = $('#current_user').html();
		var userEmail = $('#current_user_email').html();
		$http({
                    method: "post",
                    url: "/get_preferences",
                    data: {
                        user: userName,
                        email: userEmail                        
                    }
                }).success(function(data){

                	$scope.prefered = data.entries;
                	//console.log($scope.prefered);
                });
        $scope.removePreference = function(bundleId)
        	{
        		var r = confirm("Are you sure you want to remove this app ?");
        		if(r==true)
        		{
        			var data = {user:userName,email:userEmail,bundleId:bundleId};
        			$.post("/remove_preferences",data,function(response){
        					if(response==1)
        					{
        						location.reload();
        					}
        					else
        						alert("Try Again !");
        			});
        		}
        	};
        $scope.DisplayData = function(bundleId)
            {
                var id = bundleId[0][0];
                //console.log(id);
                //var data = $("#"+id).html();
                $("#app_info_area li").each(function(index){
                    $(this).children("div").hide();
                });
                $("#"+id).show();
                //console.log(data);
                //var html = $.parseHTML(data);               
                //$("#app_info_area").html(html);
            };
        

	}]);

	app.controller('SearchPreferenceController',function($scope){
		$scope.apps = "";
		var userName = $('#current_user').html();
		var userEmail = $('#current_user_email').html();
		$('#query').keypress(function(){
                    var query = $("#query").val();
                    $.post("/search_new",{query:query}, function( data ) {
                        var aq = eval('('+data+')');
                        $scope.apps = aq.entries;
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
                        location.reload();
					});
				}
			};

	});



})();