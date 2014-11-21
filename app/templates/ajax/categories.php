<?php

ini_set('display_errors', '1');

$category = $_POST["category"];
//echo $category;
include_once("../config/config.inc.php");

	if (mysqli_connect_errno()) {
 		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}					
	else
	{	
		
		
			$sql_query1 ="
				SELECT * 
				FROM  `top_free_apps`
				WHERE genre = '".$category."' 
				LIMIT 0 , 5
			";

			$sql_query2 ="
				SELECT * 
				FROM  `top_paid_apps`
				WHERE genre = '".$category."' 
				LIMIT 0 , 5
			";
			

			 $result1=mysqli_query($con,$sql_query1);
 			
 			 $result2=mysqli_query($con,$sql_query2);
 			 $data1 = [];
 			 $data2 = [];

				while ($row = $result1->fetch_assoc()) {
    				$data1[] = $row;
				}
				while ($row = $result2->fetch_assoc()) {
    				$data2[] = $row;
				}

 			 $join_row = array_merge($data1,$data2);

			//$rows=mysqli_fetch_all($result,MYSQLI_NUM);
		echo json_encode($join_row);
	}
?>