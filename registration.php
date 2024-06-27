<?php
// registration.php

require 'config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Вземане на входни данни
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $email = trim($_POST['email']);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Проверка на имената
    if (strlen($first_name) < 2 || strlen($first_name) > 40) {
        $errors[] = "First name must be between 2 and 40 characters.";
    }
    if (strlen($last_name) < 2 || strlen($last_name) > 40) {
        $errors[] = "Last name must be between 2 and 40 characters.";
    }

    // Проверка на валидността на имейла
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

    // Проверка на потребителското име
    if (strlen($username) < 5 || strlen($username) > 255) {
        $errors[] = "Username must be between 5 and 255 characters.";
    }

    // Проверка на паролата
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters.";
    }

    // Ако няма грешки, проверка за съществуващи потребителско име или имейл
    if (empty($errors)) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        if ($stmt->fetchColumn() > 0) {
            $errors[] = "Email or username already taken.";
        } else {
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)");
            if ($stmt->execute([$first_name, $last_name, $email, $username, $hashed_password])) {
                echo json_encode(["success" => "Registration successful."]); 
            } else {
                $errors[] = "Error in registration.";
            }
        }
    }

    // Показване на грешките, ако има такива
    if (!empty($errors)) {
        echo json_encode(["errors" => $errors]);
    }
}
?>