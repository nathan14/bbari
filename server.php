<?php
require 'server/Slim/Slim.php';
include 'server/dbconfig.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/',
	function () {
		echo 'Bari Bari Server - What up? :)';
	}
);

$app->response()->header("Access-Control-Allow-Origin", "*");

// --- POSTS ---
$app->get("/all-posts", function () use ($app, $conn) {
	$rows = array();
	$result = $conn->query("SELECT * FROM posts ORDER BY date DESC");

	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($rows);
});

$app->get("/post/:id", function ($id) use ($app, $conn) {
	$rows = array();
	$result = $conn->query("SELECT * FROM posts WHERE id = '$id'");

	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($rows);
});

$app->get("/posts/:month/:year", function ($month, $year) use ($app, $conn) {
	$rows = array();

	error_log($month . "\n", 3, "php.log");
	error_log($year . "\n", 3, "php.log");

	$result = $conn->query("SELECT * FROM posts WHERE MONTH(date) = '$month' AND YEAR(date) = '$year'");

	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($rows);
});

$app->post("/post-new", function () use ($app, $conn) {
	$params =  $app->request->getBody();
	$paramsDecode = json_decode($params, true);

	$title = $paramsDecode['title'];
	$type = $paramsDecode['type'];
	$date = $paramsDecode['date'];
	$authorName = $paramsDecode['authorName'];
	$authorId = $paramsDecode['authorId'];
	$shortDesc = urlencode($paramsDecode['shortDesc']);
	$content = urlencode($paramsDecode['content']);
	$recepie = urlencode($paramsDecode['recepie']);
	$recepieHowTo = urlencode($paramsDecode['recepieHowTo']);
	$imgId = $paramsDecode['imgId'];
	$badge = $paramsDecode['badge'];
	$estTime = $paramsDecode['estTime'];

	$conn->query("INSERT INTO posts (title , type, date, authorName ,authorId ,shortDesc ,content ,recepie ,recepieHowTo ,imgId, badge, estTime)
				  VALUES ('$title', '$date' ,'$authorName', '$authorId', '$shortDesc', '$content', '$recepie', '$recepieHowTo', '$imgId', '$badge', '$estTime')");

	$id = mysqli_insert_id($conn);

	error_log($id . " Query New Post Good \n", 3, "php.log");

	$app->response()->header("Content-Type", "application/json");
	$response = array("id"=>$id, "title"=>$title);
	echo json_encode($response);
});

$app->put("/post-edit", function () use ($app, $conn) {
	$params =  $app->request->getBody();
	$paramsDecode = json_decode($params, true);

	$id = $paramsDecode['id'];
	$title = $paramsDecode['title'];
	$type = $paramsDecode['type'];
	$date = $paramsDecode['date'];
	$authorName = $paramsDecode['authorName'];
	$authorId = $paramsDecode['authorId'];
	$shortDesc = urlencode($paramsDecode['shortDesc']);
	$content = urlencode($paramsDecode['content']);
	$recepie = urlencode($paramsDecode['recepie']);
	$recepieHowTo = urlencode($paramsDecode['recepieHowTo']);
	$imgId = $paramsDecode['imgId'];
	$badge = $paramsDecode['badge'];
	$estTime = $paramsDecode['estTime'];

	$rows = array();
	$conn->query("UPDATE posts
							SET title = '$title', type = '$type', date = '$date', authorName = '$authorName' ,authorId = '$authorId',
								 shortDesc = '$shortDesc', content = '$content', recepie = '$recepie',
								 recepieHowTo = '$recepieHowTo', imgId = '$imgId', badge = '$badge', estTime = '$estTime'
							WHERE id = '$id'");

	error_log($id . " Query Edit Good \n", 3, "php.log");

	$app->response()->header("Content-Type", "application/json");
	$response = array("id"=>$id, "title"=>$title);
	echo json_encode($response);
});

$app->delete("/post-delete/:id", function ($id) use ($app, $conn) {
	$rows = array();
	$conn->query("DELETE FROM posts WHERE id = '$id'");

	$app->response()->header("Content-Type", "application/json");
	$response = array("id"=>$id);
	echo json_encode($response);
});

// --- USERS ---
$app->post("/user-register", function () use ($app, $conn) {
	$params =  $app->request->getBody();
	$paramsDecode = json_decode($params, true);

	$email = $paramsDecode['email'];
	$password = $paramsDecode['password'];
	$name = $paramsDecode['name'];
	$permissions = $paramsDecode['permissions'];
	
	$conn->query("INSERT INTO users (name ,email ,password ,permissions)
				  VALUES ('$name', '$email', '$password', '$permissions')");

	error_log($email . " Query New User \n", 3, "php.log");

	$rows = array();

	$result = $conn->query("SELECT * FROM users WHERE email = '$email' AND password = '$password'");

	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($rows);
});


$app->post("/user-login", function () use ($app, $conn) {
	$params =  $app->request->getBody();
	$paramsDecode = json_decode($params, true);

	$email = $paramsDecode['email'];
	$password = $paramsDecode['password'];

	$rows = array();
	$result = $conn->query("SELECT * FROM users WHERE email = '$email' AND password = '$password'");

	error_log($email . " Query User Login \n", 3, "php.log");

	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}

	$app->response()->header("Content-Type", "application/json");
	echo json_encode($rows);
});

$app->post("/upload-img", function () use ($app, $conn) {
	error_log("Upload Image \n", 3, "php.log");

	$conn->query("INSERT INTO images (id) VALUES (NULL)");

	$id = mysqli_insert_id($conn);
	
	error_log($_FILES['file']['tmp_name'] . "\n", 3, "php.log");

	$app->response()->header("Content-Type", "application/json");
	$rows = array();

	if (0 < $_FILES['file']['error'] ) {
		echo json_encode('Error: ' . $_FILES['file']['error']);
	}
	else {
		move_uploaded_file($_FILES['file']['tmp_name'], 'img' . DIRECTORY_SEPARATOR  . 'posts' . DIRECTORY_SEPARATOR . $id . '.jpg');
		$rows['id'] = $id;
		echo json_encode($rows);
	}
});

// --- UTILS ---
$app->post("/send-email", function () use ($app, $conn) {
	$params =  $app->request->getBody();
	$paramsDecode = json_decode($params, true);

	$name = $paramsDecode['name'];
	$email = $paramsDecode['email'];
	$message = $paramsDecode['message'];

	error_log($email . " Send an Email \n", 3, "php.log");

	$app->response()->header("Content-Type", "application/json");
	echo json_encode(true);
});

$app->run();
?>