<?php
// proxy.php

// Configuration
$apiBase = '__API_BASE_URL__'; // Replaced at build time

// Get the path from the query string
$path = isset($_GET['path']) ? $_GET['path'] : '';
if (empty($path)) {
    http_response_code(400);
    echo 'Bad Request: No path specified.';
    exit;
}

// -------------------------------------------------------------------------
// Process and append Query Parameters
// -------------------------------------------------------------------------
$queryParams = $_GET;
unset($queryParams['path']);
$queryString = http_build_query($queryParams);

$url = rtrim($apiBase, '/') . '/' . ltrim($path, '/');
if (!empty($queryString)) {
    $url .= '?' . $queryString;
}

// Initialize cURL
$ch = curl_init($url);

// Forward the request method
$method = $_SERVER['REQUEST_METHOD'];
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

// Forward headers
$headers = [];
foreach (getallheaders() as $key => $value) {
    $lowerKey = strtolower($key);
    // REMOVE 'content-type' from the forward list for POST requests
    if (in_array($lowerKey, ['host', 'content-length', 'connection', 'accept-encoding', 'content-type'])) {
        continue;
    }
    $headers[] = "$key: $value";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// -------------------------------------------------------------------------
// FIX: Forward the request body correctly for Multipart/Files
// -------------------------------------------------------------------------
if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
    if (!empty($_FILES)) {
        // Rebuild the data array for multipart requests
        $postData = $_POST;
        foreach ($_FILES as $key => $file) {
            if (is_array($file['tmp_name'])) {
                // Handle multiple files (e.g., image[])
                foreach ($file['tmp_name'] as $index => $tmpName) {
                    $postData[$key . '[' . $index . ']'] = new CURLFile(
                        $tmpName, 
                        $file['type'][$index], 
                        $file['name'][$index]
                    );
                }
            } else {
                // Handle single file upload
                $postData[$key] = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
            }
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    } else {
        // Fallback for JSON or other raw input
        $input = file_get_contents('php://input');
        if (!empty($input)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
        }
    }
}

// Return the response headers
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Execute the request
$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(502);
    echo 'Bad Gateway: ' . curl_error($ch);
    exit;
}

// Split headers and body
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headerStr = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

// Forward response headers
$headerLines = explode("\r\n", $headerStr);
foreach ($headerLines as $line) {
    if (empty($line)) continue;
    if (stripos($line, 'Transfer-Encoding') === 0) continue;
    header($line);
}

// Output the body
echo $body;

curl_close($ch);