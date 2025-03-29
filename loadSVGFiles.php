<?php
// loadSVGFiles.php

session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: dashboard.html");
    exit;
}

require 'config.php';

if (isset($_GET['project_id'])) {
    $project_id = intval($_GET['project_id']);
    $stmt = $pdo->prepare("
        SELECT svg_files.id, svg_files.content, svg_files.animation_file 
        FROM svg_files 
        JOIN project_svg_files ON svg_files.id = project_svg_files.svg_file_id 
        WHERE project_svg_files.project_id = ?
    ");
    $stmt->execute([$project_id]);
    $svgFiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["svgFiles" => $svgFiles]);
    exit;
}
?>
