<?php


$query = $_POST["query"];

include_once("../config/config.inc.php");

	if (mysqli_connect_errno()) {
 		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}					
	else
	{	
		
		$sql_query = "SELECT DISTINCT
                `bundle_id`, 
                `app_name`                  
            FROM `app_desc` 
            WHERE 
                `app_name` LIKE '%".$query."%'
            LIMIT 10 
        ";
        //echo $sql_query;
		$result=mysqli_query($con,$sql_query);
		
		$response = array();

		while($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
 			
			$bundle_id = $row["bundle_id"];


			$sql_query_2 = "
				SELECT app_desc.bundle_id,app_desc.app_name,app_desc.version,app_desc.genre,images.icon, images.screenshot, rating.avg_rating, rating.rating_count,bundle.track_url
				FROM app_desc
				INNER JOIN images ON app_desc.bundle_id = images.bundle_id
				INNER JOIN rating ON images.bundle_id = rating.bundle_id
				INNER JOIN bundle ON rating.bundle_id = bundle.bundle_id
				WHERE app_desc.bundle_id =  '".$bundle_id."'
				LIMIT 10
			";

 			 $result2=mysqli_query($con,$sql_query_2);
 			 $join_row=mysqli_fetch_array($result2,MYSQLI_ASSOC);  

 			 array_push($response, $join_row);
  			
			}


			//$rows=mysqli_fetch_all($result,MYSQLI_NUM);
		echo json_encode($response);
	}
?>