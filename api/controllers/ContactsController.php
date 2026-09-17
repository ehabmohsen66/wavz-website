<?php
/**
 * WAVZ CMS — Contacts Controller
 */

declare(strict_types=1);

class ContactsController
{
    /**
     * POST /api/contacts — Public form submission
     */
    public static function submit(array $input): void
    {
        // 1. Anti-spam honeypot check
        if (!empty($input['_gotcha']) || !empty($input['company_fax'])) {
            // Silently discard bot submission
            Response::json(['success' => true, 'message' => 'Thank you for reaching out.'], 200);
            return;
        }

        // 2. Validate input
        $name    = strip_tags(trim($input['name'] ?? ''));
        $email   = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone   = strip_tags(trim($input['phone'] ?? ''));
        $company = strip_tags(trim($input['company'] ?? ''));
        $service = strip_tags(trim($input['service'] ?? ''));
        $message = strip_tags(trim($input['message'] ?? ''));

        if (empty($name) || empty($email) || empty($message)) {
            Response::badRequest('Name, email, and message are required.');
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::badRequest('Please provide a valid email address.');
            return;
        }

        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        if (str_contains($ip, ',')) {
            $ip = trim(explode(',', $ip)[0]);
        }

        // 3. Save to database
        try {
            $submission = ContactSubmission::create([
                'name'       => $name,
                'email'      => $email,
                'phone'      => $phone,
                'company'    => $company,
                'service'    => $service,
                'message'    => $message,
                'status'     => 'unread',
                'ip_address' => $ip,
            ]);
        } catch (Throwable $e) {
            error_log('Contact DB error: ' . $e->getMessage());
            // Continue to attempt email dispatch even if DB fails
        }

        // 4. Send email notification
        try {
            $settings = Setting::getAllGrouped();
            $smtpGroup = $settings['smtp'] ?? [];
            $recipients = $smtpGroup['notification_email']['value_en'] ?? 'Salma.Hegazy@wavz.com.eg, info@wavz.com.eg';

            $subject = 'WAVZ Website Inquiry — ' . ($service ? $service : 'General Inquiry');
            $htmlBody = "
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
                  Sent automatically from WAVZ for Digital Transformation website CMS.
                </div>
              </div>
            </body>
            </html>";

            Mailer::send($recipients, $subject, $htmlBody, $email);
        } catch (Throwable $e) {
            error_log('Contact Mail error: ' . $e->getMessage());
        }

        Response::json([
            'success' => true,
            'message' => 'Thank you. Your message has been received and our team will get back to you shortly.',
        ], 201);
    }

    /**
     * GET /api/contacts — Protected admin list
     */
    public static function index(): void
    {
        Auth::requireAuth();

        $filters = [];
        if (!empty($_GET['status'])) {
            $filters['status'] = trim($_GET['status']);
        }
        if (!empty($_GET['search'])) {
            $filters['search'] = trim($_GET['search']);
        }

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

        $items = ContactSubmission::getAll($filters, $limit, $offset);
        $unread = ContactSubmission::countUnread();
        $total = ContactSubmission::countTotal();

        Response::json([
            'items'  => $items,
            'unread' => $unread,
            'total'  => $total,
        ]);
    }

    /**
     * GET /api/contacts/:id — Protected admin single
     */
    public static function show(int $id): void
    {
        Auth::requireAuth();

        $item = ContactSubmission::getById($id);
        if (!$item) {
            Response::notFound('Inquiry not found.');
            return;
        }

        // Auto mark as read
        if ($item['status'] === 'unread') {
            $item = ContactSubmission::updateStatus($id, 'read');
        }

        Response::json($item);
    }

    /**
     * PUT /api/contacts/:id/status — Protected status update
     */
    public static function updateStatus(int $id, array $input): void
    {
        $user = Auth::requireAuth();

        $status = $input['status'] ?? '';
        if (empty($status)) {
            Response::badRequest('Status is required.');
            return;
        }

        try {
            $updated = ContactSubmission::updateStatus($id, $status);
            ActivityLog::log($user['id'], 'update_status', 'contact_submission', $id, [
                'status' => $status,
            ]);
            Response::json($updated);
        } catch (InvalidArgumentException $e) {
            Response::badRequest($e->getMessage());
        }
    }

    /**
     * DELETE /api/contacts/:id — Protected delete (Admin only)
     */
    public static function delete(int $id): void
    {
        $user = Auth::requireAdmin();

        $deleted = ContactSubmission::delete($id);
        if (!$deleted) {
            Response::notFound('Inquiry not found.');
            return;
        }

        ActivityLog::log($user['id'], 'delete', 'contact_submission', $id);
        Response::json(['success' => true, 'message' => 'Inquiry deleted successfully.']);
    }

    /**
     * GET /api/contacts/unread-count — Unread badge counter
     */
    public static function unreadCount(): void
    {
        Auth::requireAuth();
        $count = ContactSubmission::countUnread();
        Response::json(['unread' => $count]);
    }

    /**
     * GET /api/contacts/export — Export CSV
     */
    public static function export(): void
    {
        Auth::requireAuth();

        $rows = ContactSubmission::getAllForExport();

        $filename = 'wavz_inquiries_' . date('Y-m-d_His') . '.csv';

        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $out = fopen('php://output', 'w');
        // UTF-8 BOM for Excel Arabic character compatibility
        fwrite($out, "\xEF\xBB\xBF");

        fputcsv($out, ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Message', 'Status', 'IP Address', 'Created At']);

        foreach ($rows as $r) {
            fputcsv($out, [
                $r['id'],
                $r['name'],
                $r['email'],
                $r['phone'],
                $r['company'],
                $r['service'],
                $r['message'],
                $r['status'],
                $r['ip_address'],
                $r['created_at'],
            ]);
        }

        fclose($out);
        exit;
    }

    /**
     * POST /api/contacts/test-email — Diagnostic test email
     */
    public static function testEmail(array $input): void
    {
        $user = Auth::requireAdmin();
        $targetEmail = $input['recipient'] ?? $user['email'];

        $subject = 'WAVZ CMS — SMTP Test Email';
        $body = "
        <div style='font-family: sans-serif; padding: 20px; color: #082D4A;'>
          <h2 style='color: #1173BD;'>WAVZ CMS Email Delivery Diagnostic</h2>
          <p>This is a test notification sent from your WAVZ CMS configuration on cPanel.</p>
          <p><strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . "</p>
          <p><strong>Sent by:</strong> " . htmlspecialchars($user['name']) . " (" . htmlspecialchars($user['email']) . ")</p>
          <div style='padding: 12px; background: #e0f2fe; border-left: 4px solid #0284c7; border-radius: 4px;'>
            Your email notification settings are operating correctly!
          </div>
        </div>";

        $sent = Mailer::send($targetEmail, $subject, $body);

        if ($sent) {
            Response::json(['success' => true, 'message' => "Test email successfully sent to $targetEmail."]);
        } else {
            Response::error("Failed to deliver test email to $targetEmail. Please check your SMTP credentials.", 500);
        }
    }
}
