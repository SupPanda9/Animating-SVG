<?php
// dashboard.php

session_start();

// Проверка дали потребителят е логнат
if (!isset($_SESSION['user_id'])) {
    header("Location: dashboard.html");
    exit;
}

require 'config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $project_name = trim($_POST['project_name']);
    $user_id = $_SESSION['user_id'];

    // Check if project name already exists for the current user
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM projects WHERE name = ? AND user_id = ?");
    $stmt->execute([$project_name, $user_id]);
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        $errors[] = "Project with this name already exists.";
    }

    if (empty($project_name)) {
        $errors[] = "Project name is required.";
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare("INSERT INTO projects (name, user_id, created_date, last_modified_date) VALUES (?, ?, NOW(), NOW())");
        if ($stmt->execute([$project_name, $user_id])) {
            $project_id = $pdo->lastInsertId();
            echo json_encode(["success" => "Project created successfully.", "project_id" => $project_id]);
            exit;
        } else {
            $errors[] = "Error creating project.";
        }
    }

    if (!empty($errors)) {
        echo json_encode(["errors" => $errors]);
        exit;
<<<<<<< HEAD
    } 
} elseif (isset($_GET['action']) && $_GET['action'] == 'get_projects') {
        $user_id = $_SESSION['user_id'];
        $stmt = $pdo->prepare("SELECT id, name FROM projects WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["projects" => $projects]);
        exit;
    }
=======
    }
}

>>>>>>> 7001cac89484ab355c8e2378b4a1480bf9a2cf95
?>
