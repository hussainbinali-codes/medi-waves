<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/subscribers.json';
$csvFile = __DIR__ . '/subscribers.csv';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $subscribers = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
    if (!is_array($subscribers)) $subscribers = [];
    echo json_encode(['ok' => true, 'total' => count($subscribers), 'subscribers' => $subscribers]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

$email = strtolower(trim($data['email'] ?? ''));

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please provide a valid email address.']);
    exit;
}

$subscribers = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
if (!is_array($subscribers)) $subscribers = [];

// Check if already subscribed
foreach ($subscribers as $s) {
    if (isset($s['email']) && strtolower($s['email']) === $email) {
        echo json_encode([
            'ok' => true,
            'alreadySubscribed' => true,
            'message' => 'This email is already subscribed to our newsletter updates.',
            'subscriber' => $s
        ]);
        exit;
    }
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
    'email' => $email,
    'subscribedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    'status' => 'active',
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'source' => $data['source'] ?? 'website_footer'
];

$subscribers[] = $record;
file_put_contents($dataFile, json_encode($subscribers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

// Append CSV
$csvLine = sprintf('"%s","%s","%s","%s","%s","%s"' . "\n",
    str_replace('"', '""', $id),
    str_replace('"', '""', $email),
    str_replace('"', '""', $record['subscribedAt']),
    str_replace('"', '""', $record['status']),
    str_replace('"', '""', $record['ip']),
    str_replace('"', '""', $record['source'])
);
if (!file_exists($csvFile)) {
    file_put_contents($csvFile, "ID,Email,SubscribedAt,Status,IP,Source\n", LOCK_EX);
}
file_put_contents($csvFile, $csvLine, FILE_APPEND | LOCK_EX);

// Send notification
$to = 'Info@medi-waves.com';
$subject = "New Newsletter Subscriber: $email";
$headers = "From: Medi Waves Website <noreply@medi-waves.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$body = "<h2>New Newsletter Subscriber</h2>";
$body .= "<p>A new visitor has subscribed to newsletter updates: <strong>" . htmlspecialchars($email) . "</strong></p>";

@mail($to, $subject, $body, $headers);

http_response_code(201);
echo json_encode([
    'ok' => true,
    'id' => $id,
    'message' => 'Thank you for subscribing to our newsletter!',
    'subscriber' => $record
]);
