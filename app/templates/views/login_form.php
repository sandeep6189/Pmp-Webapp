<?php
// show potential errors / feedback (from login object)
if (isset($login)) {
    if ($login->errors) {
        foreach ($login->errors as $error) {
            echo $error;
        }
    }
    if ($login->messages) {
        foreach ($login->messages as $message) {
            echo $message;
        }
    }
}
?>

<html lang="en">
    <head>
    <meta charset="utf-8">
    <title>PmP For Android</title>
    <meta name="description" content="Flat Design Mini Portfolio">
    <meta name="keywords" content="responsive, bootstrap, Privacy, Android, App Scanner">
    <meta name="author" content="Dzyngiri">
    <meta name="description" content="This is an app to protect your privacy and act against the apps which take illegal data from your phone ">
    <!-- styles -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.css" rel="stylesheet">
     <link rel="stylesheet" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
    <link href="css/style.css" rel="stylesheet">
    <link href="font/css/fontello.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
    <link type="text/css" rel="stylesheet" href="css/touchslider.css" />
    <link rel="stylesheet" type="text/css" href="css/jquery.mobile.custom.theme.min.css">
  <script src="js/jquery-1.10.2.js"></script>
  <script src="js/touchslider.js"></script>
  <script src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
    </head>
    <body>
    <div class="navbar">
      <div class="navbar-inner">
        <div class="container"> 
              <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span> 
                 <span class="icon-bar"></span>
                <span class="icon-bar"></span>
               </a> 
            <a class="brand" href="index.php"><img src="img/user.jpg"/></a>
            <ul class="nav nav-collapse pull-right">
              <li style="margin-right: 0px;"><a href="index.php" ><i class="icon-user"></i> Profile</a></li>
              <li style="margin-left: 10px;"><a href="#" class="active"><i class="icon-paper-plane"></i> Login</a></li>
            </ul>
        </div>
      </div>
    </div>
    <!--Profile container-->
    <div class="container profile" style="width:100%;">

      <div class="span4"></div>
      <div class="span4">
              <div class="login-container" style="width:400px;margin:20px;padding:20px;background:white;border-radius:10px">
            <div class="avatar">
                <span style='font-weight: bolder;color: skyblue;font-size: x-large;'>login form</span>
            </div>
            <br>
            <div class="form-box">
                <div>
                      <form method="post" action="login.php" name="loginform">
                        <div class="form-group" style="margin-bottom:0px;">
                        <input name="user_name" id="login_input_username" class="upper login_input" id='user' type="text" placeholder="username" style="width:400px" required />
                    </div>
                    <div class="form-group" style="width:400px">
                        <input id="login_input_password" name="user_password" class="lower" type="password" placeholder="password" style="width:400px" required />
                    </div>
                    
                    <button class="btn btn-info btn-block" type="submit" name='login' value="Login">Login</button>
                </div>
                <div style="margin-top: 10px"><a href="/retrieve_password/">Forgot password ?</a></div>
                <div style="margin-top: 10px"><a href="registration.php">Register ?</a></div>
                </form>
            </div>
        </div>

      </div>
      <div class="span4"></div>
   </div>
    <!--END: Profile container-->
    <!-- Social Icons -->
    
    <!-- END: Social Icons -->
    <!-- Footer -->
    <div class="footer" style="left:0;height:50px">
      <div class="container">
        <p class="pull-left" style="margin-top:10px"><a href="#">Copyright &#169; SynergyLabs</a></p>
        <p class="pull-right" style="margin-top:10px"><a href="#myModal" role="button" data-toggle="modal"> <i class="icon-mail"></i> CONTACT</a></p>
      </div>
    </div>
  <script>
    $(document).ready(function(){
        $(document).delegate('#logging','click',function(){
          var username = $('#user').val();
          var password = $('#pwd').val();
          $.post('check_user.php',{user:username,pwd:password},function(response){
              if(response=="success")
              {
                alert("Successfully signed in ");
              }
          });
        });
      });
  </script>
  </body>
  </html>
