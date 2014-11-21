<?php

ini_set('display_errors', '1');



		$url = $_POST['url'];
		$img_src = $_POST['img_src'];
		$id = $_POST['id'];
		//make an sql query to get the app name !
include_once("../config/config.inc.php");

					$sql_query_2 = "
				SELECT app_desc.app_name,app_desc.version,app_desc.genre,images.icon, images.screenshot, rating.avg_rating, rating.rating_count,bundle.track_url
				FROM app_desc
				INNER JOIN images ON app_desc.bundle_id = images.bundle_id
				INNER JOIN rating ON images.bundle_id = rating.bundle_id
				INNER JOIN bundle ON rating.bundle_id = bundle.bundle_id
				WHERE app_desc.bundle_id =  '".$id."'
				LIMIT 10
			";

			//echo $id;


 			 $result2=mysqli_query($con,$sql_query_2);
             $join_row=mysqli_fetch_array($result2,MYSQLI_ASSOC);  

            $app_name = $join_row['app_name'];
            $version = $join_row['version'];
            $genre = $join_row['genre'];
            $rating = $join_row['avg_rating'];
            if(strlen($app_name)>16)
            {
            	$app_name = substr($app_name,0,14)."...";
            }

            //to make stars dynamically
            $str = "";
            $count = 0;

            if((int)$rating<=5)
            {
            	for($i=0;$i<(int)$rating;$i++)
            	{
            		$str= $str.(string)"<img src='img/full.png' alt='' style='height:12px'>";
            		$count = $count + 1;
            	}
            	$half = $rating - (int)$rating;
            	if($half==0.5)
            	{
            		$str=$str.(string)"<img src='img/half.png' alt='' style='height:12px'>";
            		$count = $count + 1;
            	}
            	while ($count<5)
            	{
            		$str = $str.(string)"<img src='img/empty.png' alt='' style='height:12px'>";
            		$count = $count + 1;
            	}

            }




echo <<< END

<div style='width:100%;background:#222;color:#fff;margin:0px'>
	<div class='mobile-row2' style='width:100%;height:50px;text-align:center;position:relative'>
		<h4 class='info-pmp'>
			Inside App
		</h4>
		<div id='back'>
			<div class='arrow-left'>
			</div>
			<div class='rect' style='padding-top:5px'>
			<span class='rect-text'>Back</span>
			</div>
		</div>
	</div>

	<div class='mobile-row2' style='width:100%;height:75px;text-align:center;position:relative;margin-top:0px'>
			<ul style='margin:0px'>
				<li class='mob_lis' style='left:0px'>

				<a href='$url'><img src='$img_src' width=50 height=50 style='margin:10px;border-radius: 6px;border: 2px solid beige;'></a>
				
				</li>
				
				<li class='mob_lis' style='left:24%;top:10px;font-weight:bolder;font-size:smaller;width:50%;'>
						<div style='margin-left:16%;float:left'>$app_name</div><br>
						<div style='font-weight:100;margin-left:16%;float:left'>$version</div><br>
						<div style='font-weight:100;margin-left:16%;float:left;font-size:10px'>$genre</div>
				</li>
				
				<li class='mob_lis' style='right:0px'>
					<p id="app_ratings" style='margin-top:20px;font-size:12px'>
                	
              </p>	
				</li>
			</ul>
	</div>


	
	<div class='mobile-row2' style='width:100%;height:375px;text-align:center;position:relative;margin-top:0px'>
			<div style="background:rgba(0, 0, 0, 0.31)">
			<ul style="margin-left: 0px;font-size: smaller;font-weight: bolder;" id='ind_app_details'>
				<li style="display:inline;cursor:pointer;padding:10px;padding-left:0px">Overview</li>
				<li style="display:inline;cursor:pointer;">Details</li>
				<li style="display:inline;cursor:pointer;padding-left:10px">Recommendations</li>
			</ul>
			</div>
			<div>
				<ul style="margin-left:0;">
					<li class='arrow_down' style="display:inline"><div style="width:0;height:0;border-left: 10px solid transparent;border-right: 10px solid transparent;border-top: 10px solid rgba(0, 0, 0, 0.31);position:absolute;left:10%;top:20px;"></div></li>
					<li class='arrow_down' style="display:inline"><div style="width:0;height:0;border-left: 10px solid transparent;border-right: 10px solid transparent;border-top: 10px solid rgba(0, 0, 0, 0.31);position:absolute;top:20px;left:34%;display:none"></div></li>
					<li class='arrow_down' style="display:inline"><div style="width:0;height:0;border-left: 10px solid transparent;border-right: 10px solid transparent;border-top: 10px solid rgba(0, 0, 0, 0.31);position:absolute;top:20px;left:67%;display:none"></div></li>
				</ul>	
			</div>
	</div>
	</div>
</div>
END


?>