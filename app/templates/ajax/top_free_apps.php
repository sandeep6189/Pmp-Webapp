<?php


ini_set('display_errors','1');

include_once("../config/config.inc.php");

	if (mysqli_connect_errno()) {
 		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}					
	else
	{	
		
		
			$sql_query_2 ="
				SELECT * 
				FROM  `top_free_apps` 
				LIMIT 0 , 10
			";

 			 $result2=mysqli_query($con,$sql_query_2);

 			 //$join_row=mysqli_fetch_all($result2,MYSQLI_ASSOC);  

 			 $data = [];
				while ($row = $result2->fetch_assoc()) {
    				$data[] = $row;
				}

			//$rows=mysqli_fetch_all($result,MYSQLI_NUM);
		echo json_encode($data);
	}
?>