<?php
session_start();
if(isset($_FILES['upload'])){
  $errors= array();
  $temp = explode('.',$_FILES['upload']['name']);
  $file_ext = strtolower(end($temp));
  $file_name = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', pathinfo($_FILES['upload']['name'], PATHINFO_FILENAME)))).".".$file_ext;
  $file_size = $_FILES['upload']['size'];
  $file_tmp = $_FILES['upload']['tmp_name'];
  $file_type = $_FILES['upload']['type'];
  $funcNum = $_GET['CKEditorFuncNum'];
  // Optional: might be used to provide localized messages.
  $langCode = $_GET['langCode'];
  $token = $_POST['ckCsrfToken'];

  $allowed = array('gif', 'png', 'jpg', 'JPG', 'PNG', 'jpeg', 'GIF');  
  $ext = pathinfo($_FILES['upload']['name'], PATHINFO_EXTENSION);
  if (!in_array($ext, $allowed)) {
    die('Only gif, png, and jpg type files can be upload');
  }
  if($file_size > 30097152) {
    $errors[] = 'File size must not be greater than 30MB';
  }

  if(empty($errors) == true) {
    // Folder Path
    $folder_path = dirname(__FILE__, 11).'/default/files/h5p_images/';
    // Create Directory
    if(!is_dir($folder_path)) {
      mkdir($folder_path);
    }
    // Move File to Directory
    if(move_uploaded_file($_FILES["upload"]["tmp_name"], $folder_path.$file_name)){
      // Check Https
      if(isset($_SERVER['HTTPS'])){
         $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
      }
      else{
         $protocol = 'http';
      }
      // Message for successfully upload
      $message = 'Image has been Uploaded Successfully';  
      // Create Image url
      $url = $protocol."://".$_SERVER['HTTP_HOST'] .'/sites/default/files/h5p_images/'.$file_name;
      // Tell Ckeditor About Image
      echo "<script>window.parent.CKEDITOR.tools.callFunction($funcNum, '$url', '$message')</script>";

      return json_encode([
        'uploaded' => 1,
        'fileName' => $file_name,
        'url' => $url
      ]);
      exit();
    }
    $errors[] = "File could not be uploaded!";
  }
  echo json_encode(['uploaded' => 0, "error" => [
    "message" => implode("\n", $errors)
  ]]);
  exit();
}
echo "<script>alert('No file Found for Upload!');</script>";
