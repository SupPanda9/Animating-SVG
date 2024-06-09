<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['svgFile'])) {
    $file = $_FILES['svgFile'];

    // Проверка за грешки при качването
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'Error uploading file.', 'error' => $file['error']]);
        exit;
    }

    // Проверка дали файлът е SVG
    $fileType = mime_content_type($file['tmp_name']);
    if ($fileType !== 'image/svg+xml') {
        echo json_encode(['status' => 'error', 'message' => 'Please upload a valid SVG file.']);
        exit;
    }

    // Преместване на файла в желаната директория
    //Тук не беше правилен пътя
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $filePath = $uploadDir . basename($file['name']);

    

    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        // Връщане на абсолютния URL към файла
        $svgContent = file_get_contents($filePath);
        echo json_encode(['status' => 'success', 'filePath' => $filePath, "svgContent" => $svgContent]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error moving uploaded file.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>