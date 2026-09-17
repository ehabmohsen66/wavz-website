<?php
/**
 * WAVZ CMS — Mailer Helper
 * Supports SMTP (SSL/TLS/STARTTLS) with fallback to native cPanel mail().
 */

declare(strict_types=1);

class Mailer
{
    /**
     * Send email via SMTP or native mail() fallback
     */
    public static function send(string $to, string $subject, string $htmlBody, ?string $replyTo = null): bool
    {
        // Load settings from DB
        $settings = Setting::getAllGrouped();
        $smtpGroup = $settings['smtp'] ?? [];

        $host = $smtpGroup['smtp_host']['value_en'] ?? 'mail.wavz.com.eg';
        $port = (int)($smtpGroup['smtp_port']['value_en'] ?? 465);
        $user = $smtpGroup['smtp_user']['value_en'] ?? 'info@wavz.com.eg';
        $pass = $smtpGroup['smtp_pass']['value_en'] ?? 'Wavz@2008';
        $fromName = $smtpGroup['smtp_from_name']['value_en'] ?? 'WAVZ Website Inquiries';

        $replyTo = $replyTo ?: $user;

        // Try socket SMTP first
        $sent = self::sendSocketSMTP($host, $port, $user, $pass, $user, $fromName, $to, $subject, $htmlBody, $replyTo);

        // Fallback to native PHP mail() on cPanel
        if (!$sent) {
            $headers  = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=UTF-8\r\n";
            $headers .= "From: " . mb_encode_mimeheader($fromName) . " <" . $user . ">\r\n";
            $headers .= "Reply-To: " . $replyTo . "\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();

            $sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $htmlBody, $headers, "-f" . $user);
        }

        return $sent;
    }

    /**
     * Direct socket SMTP transport
     */
    private static function sendSocketSMTP(
        string $host, int $port, string $user, string $pass,
        string $fromEmail, string $fromName, string $to, string $subject, string $body, string $replyTo
    ): bool {
        $prefix = ($port === 465) ? 'ssl://' : '';
        $socket = @fsockopen($prefix . $host, $port, $errno, $errstr, 10);
        if (!$socket) {
            return false;
        }

        $read = function() use ($socket) {
            $data = '';
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') break;
            }
            return $data;
        };

        $write = function(string $cmd) use ($socket) {
            fputs($socket, $cmd . "\r\n");
        };

        $read();
        $serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
        $write("EHLO " . $serverName);
        $read();

        if ($port !== 465 && $port !== 25) {
            $write("STARTTLS");
            $res = $read();
            if (substr($res, 0, 3) === '220') {
                stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                $write("EHLO " . $serverName);
                $read();
            }
        }

        if (!empty($user) && !empty($pass)) {
            $write("AUTH LOGIN");
            $read();
            $write(base64_encode($user));
            $read();
            $write(base64_encode($pass));
            $authRes = $read();
            if (substr($authRes, 0, 3) !== '235') {
                fclose($socket);
                return false;
            }
        }

        $write("MAIL FROM: <" . $fromEmail . ">");
        $read();

        // Handle multiple recipients comma-separated
        $recipients = array_map('trim', explode(',', $to));
        foreach ($recipients as $recipient) {
            if (!empty($recipient)) {
                $write("RCPT TO: <" . $recipient . ">");
                $read();
            }
        }

        $write("DATA");
        $read();

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . mb_encode_mimeheader($fromName) . " <" . $fromEmail . ">\r\n";
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
}
