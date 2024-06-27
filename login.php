<?php
// login.php

require 'config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Вземане на входни данни
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Проверка на потребителското име
    if (empty($username)) {
        $errors[] = "Username is required.";
    } elseif (strlen($username) < 5 || strlen($username) > 255) {
        $errors[] = "Username must be between 5 and 255 characters.";
    }

    // Проверка на паролата
    if (empty($password)) {
        $errors[] = "Password is required.";
    } elseif (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters.";
    }

    // Ако няма грешки, проверка на потребителското име и паролата в базата данни
    if (empty($errors)) {
        $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            echo json_encode(["success" => "Login successful."]);
        } else {
            $errors[] = "Invalid username or password.";
        }
    }

    // Показване на грешките, ако има такива
    if (!empty($errors)) {
        echo json_encode(["errors" => $errors]);
    }
}
?>
