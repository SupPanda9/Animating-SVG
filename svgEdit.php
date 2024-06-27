<?php
// SVGEdit.php

session_start();

// Проверка дали потребителят е логнат
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}

// Вземане на project_id от GET параметрите
$project_id = isset($_GET['project_id']) ? intval($_GET['project_id']) : null;

if (!$project_id) {
    echo "Invalid project ID.";
    exit;
}
?>
