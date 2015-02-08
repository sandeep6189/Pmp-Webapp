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
		$scope.image_src = {};
        var dic = {};
        var userName = $('#current_user').html();
		var userEmail = $('#current_user_email').html();
		$http({
                    method: "post",
                    url: "/pmp/get_preferences",
                    data: {
                        user: userName,
                        email: userEmail                        
                    }
                }).success(function(data){

                $scope.prefered = data.entries;
                   angular.forEach($scope.prefered,function(value,index){
                        var bid = value.bundleid;
                        //console.log(bid);

                        if(typeof(Storage) !== "undefined") {
                          var url=localStorage.getItem(bid); 
                          if( url !==null)
                          {
                            //return the image url
                            dic[bid] = url;
                          }
                          else
                          {
                            var url = "";
                            //make a post call to get the image_url , set in the localStorage of the client  
                                $http({
                                    method: "post",
                                    url: "/pmp/get_icon",
                                    data: {
                                        id:bid
                                    }
                                }).success(function(data){
                                    dic[bid] = data;
                                    console.log(data);
                                    localStorage.setItem(bid,data);
                                });
                            }
                        }

                    });
                    $scope.image_src = dic;
                    console.log($scope.image_src);

                    $scope.values = dic;

                    $scope.getChildren = function(parent) {
                      var children = [];
                      //for (var i = 0; i < dic.length; i++) {
                        //if (arr2[i].parent_id == parent.id) {
                          children.push(dic[parent.bundleid]);
                        //}
                      //}
                      return children;
                    };

                    $scope.removePreference = function(bundleId)
                        {
                            var r = confirm("Are you sure you want to remove this app ?");
                            if(r==true)
                            {
                                var data = {user:userName,email:userEmail,bundleId:bundleId};
                                $.post("/pmp/remove_preferences",data,function(response){
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
                    $scope.GetImage = function(bundleid)
                        {
                            //console.log(bundleid)
                            if(typeof(Storage) !== "undefined") {
                              var url =localStorage.getItem(String(bundleid)); 
                              if( url !==null)
                              {
                                //return the image url
                                return url;
                              }
                              else
                              {
                                var url = "";
                                //make a post call to get the image_url , set in the localStorage of the client  
                                $.post("/pmp/get_icon",{id:String(bundleid)},function(response){
                                  url = response;
                                  //console.log(url);
                                });
                                return url;
                              }
                            }
                        };
        });
        
	}]);

	app.controller('SearchPreferenceController',function($scope){
		$scope.apps = "";
		var userName = $('#current_user').html();
		var userEmail = $('#current_user_email').html();
		$('#query').keypress(function(){
                    var query = $("#query").val();
                    $.post("/pmp/search_new",{query:query}, function( data ) {
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
					$.post("/pmp/add_preferences",data,function(response){
                        location.reload();
					});
				}
			};

	});



})();