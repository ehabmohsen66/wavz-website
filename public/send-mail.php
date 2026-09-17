<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!$data) {
    $data = $_POST;
}

$name    = isset($data['name']) ? strip_tags(trim($data['name'])) : '';
$email   = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$phone   = isset($data['phone']) ? strip_tags(trim($data['phone'])) : '';
$company = isset($data['company']) ? strip_tags(trim($data['company'])) : '';
$service = isset($data['service']) ? strip_tags(trim($data['service'])) : '';
$message = isset($data['message']) ? strip_tags(trim($data['message'])) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email, and message are required.']);
    exit;
}

$recipient = 'Salma.Hegazy@wavz.com.eg';
$subject   = 'website form received';

$htmlContent = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #082D4A; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 15px rgba(8,45,74,0.06); }
    .header { background: #082D4A; padding: 24px; color: #ffffff; }
    .header h2 { margin: 0; font-size: 20px; color: #FFB814; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: #97CFFA; }
    .body { padding: 24px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .info-table td.label { width: 120px; font-weight: bold; color: #64748b; }
    .info-table td.val { color: #082D4A; font-weight: 500; }
    .msg-box { background: #f8fafc; border-left: 4px solid #1173BD; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #1e293b; }
    .footer { padding: 16px 24px; background: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <h2>WAVZ Website Inquiry</h2>
      <p>New submission received via wavz.com.eg contact form</p>
    </div>
    <div class='body'>
      <table class='info-table'>
        <tr><td class='label'>Name</td><td class='val'>" . htmlspecialchars($name) . "</td></tr>
        <tr><td class='label'>Email</td><td class='val'><a href='mailto:" . htmlspecialchars($email) . "' style='color: #1173BD;'>" . htmlspecialchars($email) . "</a></td></tr>
        " . ($phone ? "<tr><td class='label'>Phone</td><td class='val'>" . htmlspecialchars($phone) . "</td></tr>" : "") . "
        " . ($company ? "<tr><td class='label'>Company</td><td class='val'>" . htmlspecialchars($company) . "</td></tr>" : "") . "
        " . ($service ? "<tr><td class='label'>Service</td><td class='val'>" . htmlspecialchars($service) . "</td></tr>" : "") . "
      </table>
      <div style='font-size: 13px; font-weight: bold; color: #475569; margin-bottom: 8px;'>Message Content:</div>
      <div class='msg-box'>" . nl2br(htmlspecialchars($message)) . "</div>
    </div>
    <div class='footer'>
      Sent automatically from WAVZ for Digital Transformation website.
    </div>
  </div>
</body>
</html>";

// Function to send via direct socket SMTP
function send_via_smtp($host, $port, $username, $password, $from, $to, $subject, $body, $replyTo) {
    $socket = @fsockopen(($port == 465 ? 'ssl://' : '') . $host, $port, $errno, $errstr, 8);
    if (!$socket) {
        return false;
    }

    $read = function() use ($socket) {
        $data = '';
        while ($str = fgets($socket, 515)) {
            $data .= $str;
            if (substr($str, 3, 1) == ' ') break;
        }
        return $data;
    };

    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read();
    $write("EHLO " . $_SERVER['SERVER_NAME']);
    $read();

    if ($port != 465) {
        $write("STARTTLS");
        $res = $read();
        if (substr($res, 0, 3) == '220') {
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $write("EHLO " . $_SERVER['SERVER_NAME']);
            $read();
        }
    }

    $write("AUTH LOGIN");
    $read();
    $write(base64_encode($username));
    $read();
    $write(base64_encode($password));
    $authRes = $read();

    if (substr($authRes, 0, 3) != '235') {
        fclose($socket);
        return false;
    }

    $write("MAIL FROM: <" . $from . ">");
    $read();
    $write("RCPT TO: <" . $to . ">");
    $read();
    $write("DATA");
    $read();

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: WAVZ Website <" . $from . ">\r\n";
    $headers .= "To: <" . $to . ">\r\n";
    $headers .= "Reply-To: <" . $replyTo . ">\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "Date: " . date("r") . "\r\n";

    $write($headers . "\r\n" . $body . "\r\n.");
    $read();
    $write("QUIT");
    $read();
    fclose($socket);
    return true;
}

// 1. Attempt sending via SMTP
$sent = false;
$smtpHosts = [
    ['host' => 'mail.wavz.com.eg', 'port' => 465],
    ['host' => 'mail.wavz.com.eg', 'port' => 25],
    ['host' => 'localhost',         'port' => 25]
];

foreach ($smtpHosts as $cfg) {
    if (send_via_smtp($cfg['host'], $cfg['port'], 'info@wavz.com.eg', 'Wavz@2008', 'info@wavz.com.eg', $recipient, $subject, $htmlContent, $email)) {
        $sent = true;
        break;
    }
}

// 2. Fallback to native PHP mail() on cPanel
$deliveryMethod = $sent ? 'Direct SMTP (info@wavz.com.eg)' : 'cPanel Native MTA (mail)';
if (!$sent) {
    $mailHeaders  = "MIME-Version: 1.0\r\n";
    $mailHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $mailHeaders .= "From: WAVZ Website <info@wavz.com.eg>\r\n";
    $mailHeaders .= "Reply-To: " . $email . "\r\n";
    $mailHeaders .= "X-Mailer: PHP/" . phpversion();

    $sent = @mail($recipient, $subject, $htmlContent, $mailHeaders, "-finfo@wavz.com.eg");
}

// Record submission to a private JSON log file on the server
$logFile = __DIR__ . '/contact_submissions.json';
$logEntry = [
    'timestamp'       => date('Y-m-d H:i:s'),
    'name'            => $name,
    'email'           => $email,
    'phone'           => $phone,
    'company'         => $company,
    'service'         => $service,
    'message'         => $message,
    'recipient'       => $recipient,
    'delivery_method' => $deliveryMethod,
    'dispatched'      => $sent ? 'Yes' : 'Attempted',
    'client_ip'       => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''
];

$allLogs = [];
if (file_exists($logFile)) {
    $existing = @file_get_contents($logFile);
    if ($existing) {
        $allLogs = json_decode($existing, true) ?: [];
    }
}
array_unshift($allLogs, $logEntry);
// Keep last 100 entries
if (count($allLogs) > 100) {
    $allLogs = array_slice($allLogs, 0, 100);
}
@file_put_contents($logFile, json_encode($allLogs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'success'    => true,
    'message'    => 'Your message has been sent successfully.',
    'dispatched' => $sent ? true : false,
    'method'     => $deliveryMethod
]);
?>
