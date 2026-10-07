<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/quotes.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $quotes = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
    if (!is_array($quotes)) $quotes = [];
    echo json_encode(['ok' => true, 'total' => count($quotes), 'quotes' => $quotes]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$equipment = trim($data['equipment'] ?? '');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($equipment)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Full Name, Official Email, and Equipment category are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please provide a valid email address.']);
    exit;
}

$id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

$record = [
    'id' => $id,
    'name' => $name,
    'email' => $email,
    'equipment' => $equipment,
    'message' => $message,
    'submittedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// 1. Save atomically to quotes.json
$quotes = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
if (!is_array($quotes)) $quotes = [];
$quotes[] = $record;
file_put_contents($dataFile, json_encode($quotes, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

// 2. Send Email Notification
$to = 'Info@medi-waves.com';
$subject = "New Quote Request: $equipment ($name)";
$headers = "From: Medi Waves Website <noreply@medi-waves.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$body = "<h2>New Quote Request Received</h2>";
$body .= "<p><strong>Full Name / Hospital:</strong> " . htmlspecialchars($name) . "</p>";
$body .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
$body .= "<p><strong>Equipment Category:</strong> " . htmlspecialchars($equipment) . "</p>";
$body .= "<p><strong>Requirements & Specifications:</strong></p>";
$body .= "<p>" . nl2br(htmlspecialchars($message ?: 'None specified')) . "</p>";
$body .= "<hr><small>Sent from Medi Waves Inc. Website Quote Modal</small>";

@mail($to, $subject, $body, $headers);

echo json_encode([
    'ok' => true,
    'id' => $id,
    'message' => 'Thank you! Your quote request has been sent to our sales team.'
]);
