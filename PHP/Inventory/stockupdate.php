<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Healerz";

$conn=new mysqli($servername, $username, $password, $dbname);

if(mysqli_connect_error()){
    echo mysqli_connect_error();
    exit();
}
else{
    $drug_id = $_POST["Drug_ID"];
    $drug_stk = $_POST["StockCount"];
    $expired_date = $_POST["ExpiredDate"];
    
    // $sql="INSERT INTO druginventory(Drug_ID, StockCount, ExpiredDate) VALUES ('$drug_id', '$drug_stk','$expired_date');";
   $sql="UPDATE druginventory SET StockCount = $drug_stk, ExpiredDate = $expired_date WHERE Drug_ID = $drug_id";
    $res=mysqli_query($conn,$sql);

    if($res){
        echo "Item Added Succesfully";
    }else{
        echo "error";
    }
}