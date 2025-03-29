<?php
header('Content-Type: application/json');

// Include database configuration
require_once 'config.php';

// Check if POST request and JSON body with svgContent and name are received
$input = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($input['svgContent']) && isset($input['name'])) {
    $svgContent = $input['svgContent'];
    $name = $input['name'];
    $projectId = $input['projectId'];

    // Extract animations
    $animations = [];
    $doc = new DOMDocument();
    libxml_use_internal_errors(true); // Suppress warnings
    $doc->loadXML($svgContent); // Load SVG content

    // Find all animate and animateTransform elements
    $animateElements = $doc->getElementsByTagName('animate');
    $animateTransformElements = $doc->getElementsByTagName('animateTransform');

    // Collect animations data
    foreach ($animateElements as $animate) {
        $animation = [
            'type' => 'animate',
            'target' => $animate->parentNode->getAttribute('id'), // Assuming id is set on parent node
            'attribute' => $animate->getAttribute('attributeName'),
            'from' => $animate->getAttribute('from'),
            'to' => $animate->getAttribute('to'),
            'dur' => $animate->getAttribute('dur'),
        ];
        $animations[] = $animation;
    }

    foreach ($animateTransformElements as $animateTransform) {
        $animation = [
            'type' => 'animateTransform',
            'target' => $animateTransform->parentNode->getAttribute('id'), // Assuming id is set on parent node
            'attributeType' => $animateTransform->getAttribute('attributeType'),
            'type' => $animateTransform->getAttribute('type'),
            'from' => $animateTransform->getAttribute('from'),
            'to' => $animateTransform->getAttribute('to'),
            'dur' => $animateTransform->getAttribute('dur'),
        ];
        $animations[] = $animation;
    }

    // Prepare and execute database query
    try {
        // Insert SVG content and animations into svg_files table
        $stmt = $pdo->prepare("INSERT INTO svg_files (name, content, animation_file) VALUES (:name, :content, :animation_file)");
        $stmt->execute(['name' => $name, 'content' => $svgContent, 'animation_file' => json_encode($animations)]);

        // Retrieve the ID of the inserted SVG file
        $svgFileId = $pdo->lastInsertId();

        $stmt = $pdo->prepare("INSERT INTO project_svg_files (project_id, svg_file_id, version_number, modification_date) VALUES (:project_id, :svg_file_id, 1, NOW())");
        if ($stmt->execute(['project_id' => $projectId, 'svg_file_id' => $svgFileId])) {
            echo json_encode(["status" => "success", "svgFileId" => $svgFileId]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to create project."]);
        }
        
        // Send success response
        echo json_encode(['status' => 'success', 'svgFileId' => $svgFileId]);
    } catch (PDOException $e) {
        // Handle database error
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    // Invalid request
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}
?>
