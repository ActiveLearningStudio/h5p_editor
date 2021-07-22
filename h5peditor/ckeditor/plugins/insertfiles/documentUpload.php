<?php
session_start();
if(isset($_FILES['upload'])){
  $errors= array();
  $temp = explode('.',$_FILES['upload']['name']);
  $file_ext = strtolower(end($temp));
  $file_name = $temp[0].round(microtime(true)) .".".$file_ext;
  $file_size = $_FILES['upload']['size'];
  $file_tmp = $_FILES['upload']['tmp_name'];
  $file_type = $_FILES['upload']['type'];

  $extensions = array("pdf","docx","ppt", "doc", "rtf", "xls", "odt", "ods");
  $mime_types = array(
    // adobe
    'pdf' => 'application/pdf',
    // ms office
    'doc' => 'application/msword',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'rtf' => 'application/rtf',
    'xls' => 'application/vnd.ms-excel',
    'ppt' => 'application/vnd.ms-powerpoint',
    // open office
    'odt' => 'application/vnd.oasis.opendocument.text',
    'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
  );

  if(in_array($file_ext,$extensions) === false || in_array($file_type, $mime_types) === false){
    $errors[] = "This type of file is not allowed.";
  }

  if($file_size > 30097152) {
    $errors[] = 'File size must not be greater than 30MB';
  }

  if(empty($errors) == true) {
    $folder_path = dirname(__FILE__, 11).'/default/files/h5p_files/';
    // Create Directory
    if(!is_dir($folder_path)) {
      mkdir($folder_path);
    }

    if(move_uploaded_file($_FILES["upload"]["tmp_name"], $folder_path.$file_name)){
      if(isset($_SERVER['HTTPS'])){
        $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
      } else{
        $protocol = 'http';
      }
      $url = $protocol."://".$_SERVER['HTTP_HOST'] .'/sites/default/files/h5p_files/'.$file_name;
      echo json_encode(['uploaded' => 1, "fileName" => $file_name, "url" => $url ]);
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
