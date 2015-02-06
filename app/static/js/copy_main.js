                $( document ).ready(function() {

                      var stack = [];

                      $(document).delegate('.accordion-toggle','click', function(event){
                            event.preventDefault();
                            // create accordion variables
                            var accordion = $(this);
                            var accordionContent = accordion.next('.accordion-content');
                            var accordionToggleIcon = $(this).children('.toggle-icon');
                            
                            // toggle accordion link open class
                            accordion.toggleClass("open");
                            // toggle accordion content
                            accordionContent.slideToggle(250);
                            
                            // change plus/minus icon
                            if (accordion.hasClass("open")) {
                              accordionToggleIcon.html("<i class='fa fa-minus-circle'></i>");
                            } else {
                              accordionToggleIcon.html("<i class='fa fa-plus-circle'></i>");
                            }
                          });


                      //make a call to search.php onchange
                      $('#query').keypress(function(){

                          var query = $("#query").val();
                          $.post("/search",{query:query}, function( data ) {

                            var apps = eval('('+data+')');
                            var names = [];
                            var icon_links = [];
                            var track_url = [];
                            var rating = [];
                            for(var i=0;i<apps.length;i++)
                            {
                                //console.log(apps[i]["app_name"]);
                                names[i] = apps[i]["app_name"];
                                icon_links[i] = apps[i]["icon"];
                                track_url[i] = apps[i]["track_url"];
                                rating[i] = apps[i]["avg_rating"];
                            }

                            //the following function helps us to enable auto complete in the query input box

                            $( "#query" ).autocomplete({
                              source: names
                            });                            

                          //now place the icons in the apps_tray 
                          var str ="<div class='row social'><h1>Searched Apps</h1><ul class='social-icons'>";

                          for (var i = 0;i<icon_links.length ;i++) {
                              var alt_json = {};
                              alt_json.url = track_url[i];
                              alt_json.rating = rating[i];

                              str+="<li><a href='"+track_url[i]+"'><img src='"+icon_links[i]+"'width='50' height='50' alt='"+JSON.stringify(alt_json)+"' draggable='true' ondragstart='drag(event)' id='drag"+(i+1)+"'></a></li>";                                  
                          }
                          str+="</ul></div>";
                          $('#apps_tray').html(str);
                          //$('#app_drop').html(str);    
                          });
                        
                            
                      });

                     // alert($(window).width()+","+$(window).height());

                    $.get(flask_util.url_for('top_free_apps',{}),function(data){
                      localStorage.setItem("free_apps",data);
                      var top_apps = eval('('+data+')');

                      //alert(top_apps[0]["app_name"]);
                            var names = [];
                            var icon_links = [];
                            var track_url = [];
                            var rating = [];
                            var bundle_id = [];
                            for(var i=0;i<top_apps.length;i++)
                            {
                                //console.log(apps[i]["app_name"]);
                                names[i] = top_apps[i]["app_name"];
                                icon_links[i] = top_apps[i]["icon"];
                                track_url[i] = top_apps[i]["track_url"];
                                rating[i] = top_apps[i]["avg_rating"];
                                bundle_id[i] = top_apps[i]["bundle_id"];
                            }
                          var str = "";
                          for (var i =0;i < top_apps.length; i++) {
                            //first slice the name a bit to accomodate in the screen 
                            var name;
                            if(names[i].length>9)
                            {
                              name = names[i].slice(0,7);
                              name = name+"...";
                            }
                            else
                            {
                              name = names[i];
                            }
                            str = str+" <div class='cell'><img src="+icon_links[i]+" alt='"+track_url[i]+"' class='curve' id='"+bundle_id[i]+"'><br><span class ='icon-text'>"+name+"</span></div>";
                          };
                          $('#slidebar').html(str);
                          touchslider.createSlidePanel('#slidebar', 50, 20);
                    });
                    $.get('/top_paid_apps',function(data){
                      localStorage.setItem("paid_apps",data);
                      var top_apps = eval('('+data+')');
                      //alert(top_apps[0]["app_name"]);
                            var names = [];
                            var icon_links = [];
                            var track_url = [];
                            var rating = [];
                            var bundle_id = [];
                            for(var i=0;i<top_apps.length;i++)
                            {
                                //console.log(apps[i]["app_name"]);
                                names[i] = top_apps[i]["app_name"];
                                icon_links[i] = top_apps[i]["icon"];
                                track_url[i] = top_apps[i]["track_url"];
                                rating[i] = top_apps[i]["avg_rating"];
                                bundle_id[i] = top_apps[i]["bundle_id"];
                            }
                          var str = "";
                          for (var i =0;i < top_apps.length; i++) {
                            //first slice the name a bit to accomodate in the screen 
                            var name;
                            if(names[i].length>9)
                            {
                              name = names[i].slice(0,9);
                              name = name+"...";
                            }
                            else
                            {
                             name = names[i];
                            }

                            str = str+" <div class='cell'><img src="+icon_links[i]+" alt='"+track_url[i]+"' class='curve' id="+bundle_id[i]+"><br><span class ='icon-text'>"+name+"</span></div>";  
                          };
                          $('#slidebar2').html(str);
                          touchslider.createSlidePanel('#slidebar2', 50, 20);
                    });

                var categories = ["Entertainment","Games","Photo & Video"]
                 var c_all = ["fun","games","photo"];
                $.each(categories,function(index,value)
                {

                  $.post('/categories',{category:value},function(data){
                    localStorage.setItem(c_all[index],data);
                      var top_apps = eval('('+data+')');
                      //alert(top_apps[0]["app_name"]);
                            var names = [];
                            var icon_links = [];
                            var track_url = [];
                            var rating = [];
                            var bundle_id = [];
                            for(var i=0;i<top_apps.length;i++)
                            {
                                //console.log(apps[i]["app_name"]);
                                names[i] = top_apps[i]["app_name"];
                                icon_links[i] = top_apps[i]["icon"];
                                track_url[i] = top_apps[i]["track_url"];
                                rating[i] = top_apps[i]["avg_rating"];
                                bundle_id[i] = top_apps[i]["bundle_id"];
                            }
                          var str = "";
                          for (var i =0;i < top_apps.length; i++) {
                            //first slice the name a bit to accomodate in the screen 
                            var name;
                            if(names[i].length>9)
                            {
                              name = names[i].slice(0,9);
                              name = name+"...";
                            }
                            else
                            {
                             name = names[i];
                            }

                            str = str+" <div class='cell'><img src="+icon_links[i]+" alt='"+track_url[i]+"' class='curve' id="+bundle_id[i]+"></a><br><span class ='icon-text'>"+name+"</span></div>";  
                          };
                          $('#slidebar'+(index+3)).html(str);
                          touchslider.createSlidePanel('#slidebar'+(index+3), 50, 20);
                    });

                  });

                  // Info button click
                  var dump_screen = "";

                    $(document).delegate('#info_button', 'click', function()
                    {
                        //id screen_id is app_drop , so we need to replace it when click back
                        //take the current dump of the files and store it in a global variable 
                        dump_screen = $('#app_drop').html();
                        stack.push(dump_screen);
                        //now we can replace it with info screen 
                        $.get('/info',function(data){

                            $('#app_drop').html(data);

                        });

                    });

                    $(document).delegate('#info_button', 'tap', function()
                    {
                        //id screen_id is app_drop , so we need to replace it when click back
                        //take the current dump of the files and store it in a global variable 
                        dump_screen = $('#app_drop').html();
                        //now we can replace it with info screen 
                        stack.push(dump_screen);
                        $.get('/info.php',function(data){

                            $('#app_drop').html(data);

                        });

                    });



                     $(document).delegate('#back', 'click', function() {
                      if(stack.length>0)
                      {
                        var current = stack.pop();
                        $('#app_drop').html(current);
                      }
                      });

                      $(document).delegate('#back', 'tap', function() {    
                       if(stack.length>0)
                      {
                        var current = stack.pop();
                        $('#app_drop').html(current);
                      }
                      });

                     $(document).delegate('.curve', 'click', function() {
                        
                        dump_screen = $('#app_drop').html();
                        stack.push(dump_screen);  
                        //now we can give the id , track_url and img source to the next u.i screen
                        var div_id = $(this).closest('div').parents('div').attr('id');
                        //alert(div_id);
                         $.post('/app_details',{img_src:this.src,url:this.alt,id:this.id,div_id:div_id},function(data){
                              
                              var form = eval('('+data+')');  
                              var html_str = "<div style='width:100%;color:#fff;margin:0px'><div class='mobile-row2' style='width:100%;height:80px;text-align:center;position:relative'>"+
        "<h4 class='info-pmp'>"+
          "Inside App"+
        "</h4>"+
        "<div id='back'>"+
          "<div class='arrow-left'>"+
          "</div>"+
          "<div class='rect' style='padding-top:5px'>"+
          "<span class='rect-text'>Back</span>"+
          "</div>"+
        "</div>"+
      "</div>"+

      "<div class='mobile-row2' style='width:100%;height:75px;text-align:center;position:relative;margin-top:0px'>"+
          "<ul style='margin:0px'>"+
            "<li class='mob_lis' style='left:0px'>"+

            "<a href="+form[1]+"><img src=' "+form[2]+" ' width=50 height=50 style='margin:10px;border-radius: 6px;border: 2px solid beige;'></a>"+
            
            "</li>"+
            
            "<li class='mob_lis' style='left:24%;top:10px;font-weight:bolder;font-size:smaller;width:50%;'>"+
                "<div style='margin-left:16%;float:left'> "+form[3]+"</div><br>"+
                "<div style='font-weight:100;margin-left:16%;float:left'> "+form[4]+"</div><br>"+
                "<div style='font-weight:100;margin-left:16%;float:left;font-size:10px'>"+form[5]+"</div>"+
            "</li>"+
            
            "<li class='mob_lis' style='right:0px'>"+
            "<p id='app_ratings' style='margin-top:20px;font-size:12px'>"+
                       " "+form[0]+" "+
                       " </p> "+ 
            "</li>"+
          "</ul>"+
      "</div>"+
   
      "<div class='mobile-row2' id='slider' style='width:100%;height:375px;text-align:center;position:relative;margin-top:0px'>"+
        "<div class='swipe' id='slider-content'>"+
          "<div class='swipe-wrap'>"+
            "<div>"+
                "<div class='header mobile-row2' style='padding:5px;'>"+
                  "Overview"+
                "</div>"+
                "<div id='overview'>"+ 
        
                    "<ul data-role='listview' id='myList' data-inset='true' data-theme='b'>"+
                    "<li><a href='#'>Tracks usage (Flurry analytics)</a></li>"+
                    "<li><a href='#'>Can read your Calendar</a></li>"+
                    "<li><a href='#''>May drain battery tracking location</a></li>"+
                    "<li><a href='#'>Connects to Twitter</a></li>"+
                    "<li><a href='#'>Connects to Facebook</a></li>"+
                    "<li><a href='#'>Access to Contacts</a></li>"+
                    "<li><a href='#''>Checks Browser History</a></li>"+
                  "</ul>"+                      
                  "</div>"+
            "</div>"+

            "<div>Details</div>"+
            "<div>Recommendations</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "</div>"+
    "</div>";
    $('#app_drop').html(html_str);
                         });

                      });

                     $(document).delegate('.curve', 'tap', function() {
                        
                        dump_screen = $('#app_drop').html();
                        stack.push(dump_screen);
                        //now we can give the id , track_url and img source to the next u.i screen
                        var div_id = $(this).closest('div').parents('div').attr('id');
                        //alert(div_id);
                         $.post('/app_details',{img_src:this.src,url:this.alt,id:this.id,div_id:div_id},function(data){
                              $('#app_drop').html(data);
                         });

                          $('div#app_drop').scrollTop(0);

                      });

                     $(document).delegate('#mobile_search','keypress',function(){
                        if($('#back').css('display') == 'none')
                        {
                          //alert("Not visible yet");
                          dump_screen = $('#app_drop').html();
                          stack.push(dump_screen);
                        }
                        $('#back').show();
                        var panel_data =  $('#search_panel').html();
                        $('#search_panel').html("");
                        var query = $('#mobile_search').val();
                        $.post('/search',{query:query},function(data){
                            var s = eval('('+data+')');
                            var str = "";
                            for(var i =0;i<s.length;i++)
                              {
                                str+="<div class='mobile-row2' style='width:100%;height:75px;text-align:center;position:relative;margin-top:0px'><ul style='margin:0px'><li class='mob_lis' style='left:0px'><img src='"+s[i]['icon']+"' class='expa' width=50 height=50 style='margin:10px;border-radius: 6px;border: 2px solid beige;' alt="+s[i]['track_url']+" id='"+s[i]['bundle_id']+"'></li><li class='mob_lis' style='left:18%;top:10px;font-weight:bolder;font-size:smaller;width:80%;'><div style='margin-left:16%;float:left'>"+s[i]['app_name']+"</div><br><div style='font-weight:100;margin-left:16%;float:left'>"+s[i]['version']+"</div><br><div style='font-weight:100;margin-left:16%;float:left;font-size:10px'>"+s[i]['genre']+"</div></li></div>";
                              } 
                          $('#search_panel').html(str);
                        });
                                                $('div#app_drop').scrollTop(0);

                     });

                    $(document).delegate('.expa', 'click', function() {
                        dump_screen = $('#app_drop').html();
                        stack.push(dump_screen);
                        //now we can give the id , track_url and img source to the next u.i screen
                        //var div_id = $(this).closest('div').parents('div').attr('id');
                        //alert(div_id);
                         $.post('/search_results',{img_src:this.src,url:this.alt,id:this.id},function(data){
                              
                              var form = eval('('+data+')');
                              
                              
                              var html_str = "<div style='width:100%;color:#fff;margin:0px'><div class='mobile-row2' style='width:100%;height:80px;text-align:center;position:relative'>"+
                              "<h4 class='info-pmp'>"+
                                "Inside App"+
                              "</h4>"+
                              "<div id='back'>"+
                                "<div class='arrow-left'>"+
                                "</div>"+
                                "<div class='rect' style='padding-top:5px'>"+
                                "<span class='rect-text'>Back</span>"+
                                "</div>"+
                              "</div>"+
                            "</div>"+

                            "<div class='mobile-row2' style='width:100%;height:75px;text-align:center;position:relative;margin-top:0px'>"+
                                "<ul style='margin:0px'>"+
                                  "<li class='mob_lis' style='left:0px'>"+

                                  "<a href="+form[1]+"><img src=' "+form[2]+" ' width=50 height=50 style='margin:10px;border-radius: 6px;border: 2px solid beige;'></a>"+
                                  
                                  "</li>"+
                                  
                                  "<li class='mob_lis' style='left:24%;top:10px;font-weight:bolder;font-size:smaller;width:50%;'>"+
                                      "<div style='margin-left:16%;float:left'> "+form[3]+"</div><br>"+
                                      "<div style='font-weight:100;margin-left:16%;float:left'> "+form[4]+"</div><br>"+
                                      "<div style='font-weight:100;margin-left:16%;float:left;font-size:10px'>"+form[5]+"</div>"+
                                  "</li>"+
                                  
                                  "<li class='mob_lis' style='right:0px'>"+
                                  "<p id='app_ratings' style='margin-top:20px;font-size:12px'>"+
                                             " "+form[0]+" "+
                                             " </p> "+ 
                                  "</li>"+
                                "</ul>"+
                            "</div>"+
                         
                            "<div class='mobile-row2' id='slider' style='width:100%;height:375px;text-align:center;position:relative;margin-top:0px'>"+
                              "<div class='swipe' id='slider-content'>"+
                                "<div class='swipe-wrap'>"+
                                  "<div>"+
                                      "<div class='header mobile-row2' style='padding:5px;'>"+
                                        "Overview"+
                                      "</div>"+
                                      "<div id='overview'>"+ 
                              
                                          "<ul data-role='listview' id='myList' data-inset='true' data-theme='b'>"+
                                          "<li><a href='#'>Tracks usage (Flurry analytics)</a></li>"+
                                          "<li><a href='#'>Can read your Calendar</a></li>"+
                                          "<li><a href='#''>May drain battery tracking location</a></li>"+
                                          "<li><a href='#'>Connects to Twitter</a></li>"+
                                          "<li><a href='#'>Connects to Facebook</a></li>"+
                                          "<li><a href='#'>Access to Contacts</a></li>"+
                                          "<li><a href='#''>Checks Browser History</a></li>"+
                                        "</ul>"+                      
                                        "</div>"+
                                  "</div>"+

                                  "<div>Details</div>"+
                                  "<div>Recommendations</div>"+
                                "</div>"+
                              "</div>"+
                            "</div>"+
                            "</div>"+
                          "</div>";
                          $('#app_drop').html(html_str);


                         }); 

                         $('div#app_drop').scrollTop(0); 

                      });
                    $(document).delegate('ul#ind_app_details>li', 'click', function() {
                        var i = $(this).index();
                        //alert(i);
                        $('.arrow_down>li').each(function(){
                            //$(this).css("display:none");
                            $(this).hide();
                        });
                      $('.arrow_down>li:eq('+i+')').show();
                        
                      });

                    var see_all = ["free_apps","paid_apps","fun","games","photo"];
                      $.each(see_all,function(index,value)
                        {
                          $(document).delegate("#"+value,"tap",function(){
                              var data = localStorage.getItem(value);
                              var top_apps = eval('('+data+')');
                              var str = parse_search(top_apps);
                              dump_screen = $('#app_drop').html();
                              stack.push(dump_screen);
                              $('#search_panel').html(str);
                              $('#back').show();
                            });
                          $('div#app_drop').scrollTop(0);
                        });

                      $.each(see_all,function(index,value)
                        {
                          $(document).delegate("#"+value,"click",function(){
                              var data = localStorage.getItem(value);
                              var top_apps = eval('('+data+')');
                              var str = parse_search(top_apps);
                              dump_screen = $('#app_drop').html();
                              stack.push(dump_screen);
                              $('#search_panel').html(str);
                              $('#back').show();
                            });
                          $('div#app_drop').scrollTop(0);
                        });



                  });

                function allowDrop(ev) {
                            ev.preventDefault();
                        }

                function drag(ev) {
                       ev.dataTransfer.setData("text/html", ev.target.id);
                            }
                function drop(ev) {
                          ev.preventDefault();
                          
                          var img_src = document.getElementById(ev.dataTransfer.getData("text/html")).src;
                          
                          var data_alt = document.getElementById(ev.dataTransfer.getData("text/html")).getAttribute('alt');
                          var obj = jQuery.parseJSON(data_alt);

                          //call a function to set the no of stars of the app 
                          make_stars(obj.rating);
                          
                          var div_data = $('#screen_data').html();
                          alert(div_data);

                          var str="<div id='mainPic'><a href='"+obj.url+"'><img src='"+img_src+"' height=30 width=30></a></div>"+div_data;             

                          //alert(str);
                          $("#app_drop").html(str);
                          
                      }
                function make_stars(stars)
                  {
                    var str = "";
                    var i;
                      //first find no . of full stars 
                      for (i=0;i<parseInt(stars); i++) {
                        str = str+"<img src='img/full.png' alt='' style='height:15px'>";
                      }

                      //alert(parseInt(stars)+","+i+","+stars);
                      if((stars-i)==0.5)
                      {
                        str = str + "<img src='img/half.png' alt='' style='height:15px'>";
                        stars = parseFloat(stars)+0.5;
                      }
                      //alert(stars);
                      for(var j = parseInt(stars);j<5;j++)
                        str = str + "<img src='img/empty.png' alt='' style='height:15px'>";

                      //alert(str);
                      $('#app_ratings').html(" ");
                      $('#app_ratings').html(str);
                  }


                   function parse_search(s)
                  {
                            var str = "";
                            for(var i =0;i<s.length;i++)
                              {
                                str+="<div class='mobile-row2' style='width:100%;height:75px;text-align:center;position:relative;margin-top:0px'><ul style='margin:0px'><li class='mob_lis' style='left:0px'><img src="+s[i]['icon']+" class='curve' width=50 height=50 style='margin:10px;border-radius: 6px;border: 2px solid beige;' alt="+s[i]['track_url']+" id='"+s[i]['bundle_id']+"'></li><li class='mob_lis' style='left:18%;top:10px;font-weight:bolder;font-size:smaller;width:80%;'><div style='margin-left:16%;float:left'>"+s[i]['app_name']+"</div><br><div style='font-weight:100;margin-left:16%;float:left'>"+s[i]['version']+"</div><br><div style='font-weight:100;margin-left:16%;float:left;font-size:10px'>"+s[i]['genre']+"</div></li></div>";
                              }
                            return str; 
                  }
          //$('#myModal').modal('hidden');
