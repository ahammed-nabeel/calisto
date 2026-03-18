<?php
// ============================================================
//  CALISTO ADMIN — FILE UPLOAD HANDLER
//  POST /admin/upload.php
//  Accepts: multipart/form-data with file + type fields
//  type: "image" → saves to ../assets/products/images/
//  type: "datasheet" → saves to ../assets/products/datasheets/
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Auth: check session cookie set by login.php (simple token check) ──
// For now we accept any POST — add session check here if needed
// session_start(); if (!isset($_SESSION['calisto_admin'])) { http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (empty($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file     = $_FILES['file'];
$type     = isset($_POST['type']) ? $_POST['type'] : 'image';
$name     = isset($_POST['name']) ? trim($_POST['name']) : '';

// ── Validate upload ──
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form upload limit',
        UPLOAD_ERR_PARTIAL    => 'File only partially uploaded',
        UPLOAD_ERR_NO_FILE    => 'No file uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temp folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by extension',
    ];
    http_response_code(400);
    echo json_encode(['error' => $errors[$file['error']] ?? 'Upload error ' . $file['error']]);
    exit;
}

// ── Allowed types ──
$imageTypes     = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
$datasheetTypes = ['application/pdf', 'image/png', 'image/jpeg'];

$mime = mime_content_type($file['tmp_name']);

if ($type === 'image') {
    if (!in_array($mime, $imageTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Images must be JPEG, PNG, WebP, or GIF. Got: ' . $mime]);
        exit;
    }
    $maxSize = 10 * 1024 * 1024; // 10 MB
    $destDir = '../assets/products/images/';
} else {
    if (!in_array($mime, $datasheetTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Datasheets must be PDF or image files. Got: ' . $mime]);
        exit;
    }
    $maxSize = 20 * 1024 * 1024; // 20 MB
    $destDir = '../assets/products/datasheets/';
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Max: ' . ($maxSize / 1024 / 1024) . ' MB']);
    exit;
}

// ── Create destination directory ──
if (!is_dir($destDir)) {
    if (!mkdir($destDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not create upload directory']);
        exit;
    }
}

// ── Build safe filename ──
$originalName = pathinfo($file['name'], PATHINFO_FILENAME);
$ext          = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Sanitize: lowercase, spaces → hyphens, remove non-alphanumeric except hyphens
$safeName = preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $originalName)));
$safeName = preg_replace('/-+/', '-', trim($safeName, '-'));
if (empty($safeName)) $safeName = 'file';

// Add timestamp to avoid collisions
$filename = $safeName . '-' . time() . '.' . $ext;
$destPath = $destDir . $filename;

// ── Move uploaded file ──
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file on server']);
    exit;
}

// ── Return the public path (relative to website root) ──
$publicPath = 'assets/products/' . ($type === 'image' ? 'images/' : 'datasheets/') . $filename;

echo json_encode([
    'success'  => true,
    'path'     => $publicPath,
    'filename' => $filename,
    'name'     => $name ?: $originalName,
    'size'     => $file['size'],
    'mime'     => $mime,
]);
