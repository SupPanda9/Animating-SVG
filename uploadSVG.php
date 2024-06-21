<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['svgFiles'])) {
    $files = $_FILES['svgFiles'];
    $response = ['status' => 'success', 'svgContents' => [], 'messages' => []];

    for ($i = 0; $i < count($files['name']); $i++) {
        // Проверка за грешки при качването
        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
            $response['status'] = 'error';
            $response['messages'][] = 'Error uploading file: ' . $files['name'][$i] . ' with error code: ' . $files['error'][$i];
            continue;
        }

        // Проверка дали файлът е SVG
        $fileType = mime_content_type($files['tmp_name'][$i]);
        if ($fileType !== 'image/svg+xml') {
            $response['status'] = 'error';
            $response['messages'][] = 'File ' . $files['name'][$i] . ' is not a valid SVG file.';
            continue;
        }

        // Преместване на файла в желаната директория
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $filePath = $uploadDir . basename($files['name'][$i]);

        if (move_uploaded_file($files['tmp_name'][$i], $filePath)) {
            // Връщане на съдържанието на файла
            $svgContent = file_get_contents($filePath);
            //добавя елемента в края на масива
            $response['svgContents'][] = $svgContent;
        } else {
            $response['status'] = 'error';
            $response['messages'][] = 'Error moving uploaded file: ' . $files['name'][$i];
        }
    }

    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>
