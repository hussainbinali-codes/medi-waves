<?php
// Minimal dependency-free SMTP client (STARTTLS + AUTH LOGIN) for sending
// the contact-form notification via Gmail SMTP. No Composer/PHPMailer
// required, so it works on plain shared hosting.

function smtp_send_mail(array $opts): array {
    $host = $opts['host'];
    $port = $opts['port'];
    $username = $opts['username'];
    $password = $opts['password'];
    $from = $opts['from'];
    $fromName = $opts['fromName'];
    $to = $opts['to'];
    $replyTo = $opts['replyTo'];
    $subject = $opts['subject'];
    $textBody = $opts['textBody'];
    $htmlBody = $opts['htmlBody'];

    $errno = 0;
    $errstr = '';
    $socket = @stream_socket_client(
        "tcp://{$host}:{$port}",
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT
    );
    if (!$socket) {
        return ['sent' => false, 'reason' => 'connect_failed', 'error' => $errstr];
    }
    stream_set_timeout($socket, 15);

    $read = function () use ($socket) {
        $data = '';
        while (($line = fgets($socket, 515)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') break;
        }
        return $data;
    };
    $write = function ($cmd) use ($socket) {
        fwrite($socket, $cmd . "\r\n");
    };
    $expect = function ($data, $code) {
        return strpos($data, (string) $code) === 0;
    };

    $resp = $read();
    if (!$expect($resp, 220)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'no_greeting', 'error' => $resp];
    }

    $write("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
    $resp = $read();

    $write("STARTTLS");
    $resp = $read();
    if (!$expect($resp, 220)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'starttls_failed', 'error' => $resp];
    }
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'tls_failed'];
    }

    $write("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
    $resp = $read();

    $write("AUTH LOGIN");
    $resp = $read();
    if (!$expect($resp, 334)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'auth_start_failed', 'error' => $resp];
    }

    $write(base64_encode($username));
    $resp = $read();
    if (!$expect($resp, 334)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'auth_user_rejected', 'error' => $resp];
    }

    $write(base64_encode($password));
    $resp = $read();
    if (!$expect($resp, 235)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'auth_failed', 'error' => $resp];
    }

    $write("MAIL FROM:<{$from}>");
    $resp = $read();
    if (!$expect($resp, 250)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'mail_from_rejected', 'error' => $resp];
    }

    $write("RCPT TO:<{$to}>");
    $resp = $read();
    if (!$expect($resp, 250) && !$expect($resp, 251)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'rcpt_to_rejected', 'error' => $resp];
    }

    $write("DATA");
    $resp = $read();
    if (!$expect($resp, 354)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'data_rejected', 'error' => $resp];
    }

    $boundary = 'mw-' . bin2hex(random_bytes(12));
    $headers = [];
    $headers[] = 'From: ' . mb_encode_mimeheader($fromName, 'UTF-8') . " <{$from}>";
    $headers[] = "To: <{$to}>";
    if ($replyTo) {
        $headers[] = "Reply-To: <{$replyTo}>";
    }
    $headers[] = 'Subject: ' . mb_encode_mimeheader($subject, 'UTF-8');
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
    $headers[] = 'Date: ' . date('r');

    $body = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $body .= wordwrap($textBody, 990, "\r\n") . "\r\n\r\n";
    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";
    $body .= $htmlBody . "\r\n\r\n";
    $body .= "--{$boundary}--\r\n";

    // Dot-stuff any line beginning with a lone "." per RFC 5321.
    $payload = implode("\r\n", $headers) . "\r\n\r\n" . $body;
    $payload = preg_replace('/^\./m', '..', $payload);

    $write($payload . "\r\n.");
    $resp = $read();
    if (!$expect($resp, 250)) {
        fclose($socket);
        return ['sent' => false, 'reason' => 'send_rejected', 'error' => $resp];
    }

    $write("QUIT");
    fclose($socket);

    return ['sent' => true];
}
