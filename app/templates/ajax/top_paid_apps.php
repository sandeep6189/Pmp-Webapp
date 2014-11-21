<?php


$query = $_POST["query"];

include_once("../config/config.inc.php");

	if (mysqli_connect_errno()) {
 		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}					
	else
	{	
		
			$sql_query_2 ="
				SELECT * 
				FROM  `top_paid_apps` 
				LIMIT 0 , 10
			";

 			 $result2=mysqli_query($con,$sql_query_2);


 			 $data = [];
				while ($row = $result2->fetch_assoc()) {
    				$data[] = $row;
				}

			//$rows=mysqli_fetch_all($result,MYSQLI_NUM);
		echo json_encode($data);
	}
?>