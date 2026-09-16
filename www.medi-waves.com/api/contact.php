<?php
// Contact-form endpoint for shared/PHP hosting.
// Mirrors api/server.js + api/mailer.js (the Node dev version) but needs
// no running process — just PHP, which shared hosts provide out of the box.

header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = [
    'https://www.medi-waves.com',
    'https://medi-waves.com',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function send_json(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(404, ['ok' => false, 'error' => 'Not found.']);
}

$raw = file_get_contents('php://input', false, null, 0, 20 * 1024);
$data = json_decode($raw ?: '{}', true);
if (!is_array($data)) {
    send_json(400, ['ok' => false, 'error' => 'Invalid request body.']);
}

$name = trim(substr((string)($data['name'] ?? ''), 0, 200));
$email = trim(substr((string)($data['email'] ?? ''), 0, 200));
$website = trim(substr((string)($data['website'] ?? ''), 0, 300));
$message = trim(substr((string)($data['message'] ?? ''), 0, 4000));

if ($name === '' || $email === '' || $message === '') {
    send_json(422, ['ok' => false, 'error' => 'Name, email and message are required.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['ok' => false, 'error' => 'Please provide a valid email address.']);
}

$configFile = __DIR__ . '/config.php';
$config = is_file($configFile) ? require $configFile : [];
$emailUser = $config['EMAIL_USER'] ?? '';
$emailPass = $config['EMAIL_PASS'] ?? '';
$receiver = $config['CONTACT_RECEIVER'] ?? $emailUser;

$submission = [
    'id' => bin2hex(random_bytes(16)),
    'name' => $name,
    'email' => $email,
    'website' => $website,
    'message' => $message,
    'submittedAt' => gmdate('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
];

// Persist the submission (best-effort — email sending below is what matters most).
$dataFile = __DIR__ . '/submissions.json';
try {
    $list = [];
    if (is_file($dataFile)) {
        $list = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    $list[] = $submission;
    file_put_contents($dataFile, json_encode($list, JSON_PRETTY_PRINT));
} catch (Throwable $e) {
    // Non-fatal — continue to attempt the email.
}

if ($emailUser !== '' && $emailPass !== '') {
    require __DIR__ . '/smtp-mailer.php';

    $textBody = "Name: {$name}\nEmail: {$email}\n"
        . ($website !== '' ? "Website: {$website}\n" : '')
        . "\nMessage:\n{$message}";

    $htmlBody = '<h2>New Contact Form Submission</h2>'
        . "<p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>"
        . "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>"
        . ($website !== '' ? "<p><strong>Website:</strong> " . htmlspecialchars($website) . "</p>" : '')
        . "<p><strong>Message:</strong></p><p>" . nl2br(htmlspecialchars($message)) . "</p>";

    smtp_send_mail([
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => $emailUser,
        'password' => $emailPass,
        'from' => $emailUser,
        'fromName' => 'Medi Waves Website',
        'to' => $receiver,
        'replyTo' => $email,
        'subject' => "New Contact Form Submission from {$name}",
        'textBody' => $textBody,
        'htmlBody' => $htmlBody,
    ]);
    // Fire-and-forget semantics: a failed send never fails the API response
    // since the submission is already saved above.
}

send_json(200, ['ok' => true, 'id' => $submission['id']]);
