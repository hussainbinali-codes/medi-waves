<?php
// Footer newsletter signup endpoint. Reuses the same SMTP mailer as the
// contact form: saves the subscriber and emails a notification.

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

$raw = file_get_contents('php://input', false, null, 0, 4 * 1024);
$data = json_decode($raw ?: '{}', true);
if (!is_array($data)) {
    send_json(400, ['ok' => false, 'error' => 'Invalid request body.']);
}

$email = trim(substr((string)($data['email'] ?? ''), 0, 200));
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(422, ['ok' => false, 'error' => 'Please provide a valid email address.']);
}

$configFile = __DIR__ . '/config.php';
$config = is_file($configFile) ? require $configFile : [];
$emailUser = $config['EMAIL_USER'] ?? '';
$emailPass = $config['EMAIL_PASS'] ?? '';
$receiver = $config['CONTACT_RECEIVER'] ?? $emailUser;

$subscriber = [
    'id' => bin2hex(random_bytes(16)),
    'email' => $email,
    'subscribedAt' => gmdate('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
];

$dataFile = __DIR__ . '/subscribers.json';
try {
    $list = [];
    if (is_file($dataFile)) {
        $list = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    foreach ($list as $existing) {
        if (isset($existing['email']) && strcasecmp($existing['email'], $email) === 0) {
            send_json(200, ['ok' => true, 'id' => $existing['id'], 'alreadySubscribed' => true]);
        }
    }
    $list[] = $subscriber;
    file_put_contents($dataFile, json_encode($list, JSON_PRETTY_PRINT));
} catch (Throwable $e) {
    // Non-fatal — continue to attempt the notification email.
}

if ($emailUser !== '' && $emailPass !== '') {
    require __DIR__ . '/smtp-mailer.php';

    smtp_send_mail([
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => $emailUser,
        'password' => $emailPass,
        'from' => $emailUser,
        'fromName' => 'Medi Waves Website',
        'to' => $receiver,
        'replyTo' => $email,
        'subject' => 'New Newsletter Subscriber',
        'textBody' => "New newsletter signup: {$email}",
        'htmlBody' => '<p>New newsletter signup: <strong>' . htmlspecialchars($email) . '</strong></p>',
    ]);
}

send_json(200, ['ok' => true, 'id' => $subscriber['id']]);
