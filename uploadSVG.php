<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['svgFiles'])) {
    $files = $_FILES['svgFiles'];
    $response = ['status' => 'success', 'svgContents' => [], 'messages' => []];
    $idCounter = 1;

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
            $svgContent = file_get_contents($filePath);

            // Използване на DOMDocument и XPath за идентифициране на всеки елемент
            $dom = new DOMDocument();
            $dom->loadXML($svgContent);
            $xpath = new DOMXPath($dom);
            $elements = $xpath->query('//*[not(self::defs)]'); // Избягване на елементите в <defs>

            foreach ($elements as $index => $element) {
                $tagName = $element->tagName;
                $element->setAttribute('id', $tagName . ($index + 1)); // Пример: rect1, circle2, и т.н.
            }

            // Съхранение на промененото SVG съдържание
            $modifiedSvgContent = $dom->saveXML();
            file_put_contents($filePath, $modifiedSvgContent);

            $response['svgContents'][] = $modifiedSvgContent;
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
