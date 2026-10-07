<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/submissions.json';
$csvFile = __DIR__ . '/submissions.csv';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $submissions = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
    if (!is_array($submissions)) $submissions = [];
    echo json_encode(['ok' => true, 'total' => count($submissions), 'submissions' => $submissions]);
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
$website = trim($data['website'] ?? '');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name, email and message are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
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
    'website' => $website,
    'message' => $message,
    'submittedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// 1. Save JSON
$submissions = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
if (!is_array($submissions)) $submissions = [];
$submissions[] = $record;
file_put_contents($dataFile, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

// 2. Save CSV
$csvLine = sprintf('"%s","%s","%s","%s","%s","%s","%s"' . "\n",
    str_replace('"', '""', $id),
    str_replace('"', '""', $name),
    str_replace('"', '""', $email),
    str_replace('"', '""', $website),
    str_replace('"', '""', $message),
    str_replace('"', '""', $record['submittedAt']),
    str_replace('"', '""', $record['ip'])
);
if (!file_exists($csvFile)) {
    file_put_contents($csvFile, "ID,Name,Email,Website,Message,SubmittedAt,IP\n", LOCK_EX);
}
file_put_contents($csvFile, $csvLine, FILE_APPEND | LOCK_EX);

// 3. Send Email Notification
$to = 'Info@medi-waves.com';
$subject = "New Contact Form Submission from $name";
$headers = "From: Medi Waves Website <noreply@medi-waves.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$body = "<h2>New Contact Form Submission</h2>";
$body .= "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>";
$body .= "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
if ($website) $body .= "<p><strong>Website:</strong> " . htmlspecialchars($website) . "</p>";
$body .= "<p><strong>Message:</strong></p>";
$body .= "<p>" . nl2br(htmlspecialchars($message)) . "</p>";

@mail($to, $subject, $body, $headers);

echo json_encode(['ok' => true, 'id' => $id]);
