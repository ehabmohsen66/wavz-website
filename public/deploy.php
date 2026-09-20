<?php
/**
 * WAVZ 1-Click Server-Side Extractor
 * Automatically extracts cpanel-deploy.zip directly into public_html/
 */
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WAVZ - Auto Deployment Extractor</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #061E31; color: #e2e8f0; padding: 40px 20px; line-height: 1.6; }
        .box { max-width: 700px; margin: 0 auto; background: #082D4A; border: 1px solid rgba(17,115,189,0.3); border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #FFB814; font-size: 22px; margin-top: 0; }
        .success { color: #34d399; font-weight: bold; }
        .error { color: #f87171; font-weight: bold; }
        .log { background: #04121f; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; margin: 16px 0; max-height: 300px; overflow-y: auto; }
        .btn { display: inline-block; background: #FFB814; color: #061E31; font-weight: 700; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-right: 10px; }
    </style>
</head>
<body>
<div class="box">
    <h1>🚀 WAVZ Deployment Extractor</h1>
<?php
$zipPath = __DIR__ . '/cpanel-deploy.zip';

if (!file_exists($zipPath)) {
    echo '<p class="error">❌ cpanel-deploy.zip was not found in ' . htmlspecialchars(__DIR__) . '</p>';
    echo '<p>Please upload <code>cpanel-deploy.zip</code> into <code>public_html/</code> and refresh this page.</p>';
} elseif (!class_exists('ZipArchive')) {
    echo '<p class="error">❌ PHP ZipArchive extension is not enabled on this server.</p>';
    echo '<p>Please right-click <code>cpanel-deploy.zip</code> in cPanel File Manager and click <b>Extract</b>.</p>';
} else {
    $zip = new ZipArchive();
    $res = $zip->open($zipPath);
    if ($res === true) {
        $extracted = $zip->extractTo(__DIR__);
        $numFiles = $zip->numFiles;
        $zip->close();
        if ($extracted) {
            echo '<p class="success">✅ Successfully extracted ' . $numFiles . ' files into ' . htmlspecialchars(__DIR__) . '!</p>';
            echo '<div class="log">';
            echo '• Public website updated (index.html, assets/)<br>';
            echo '• CMS Admin updated (admin/)<br>';
            echo '• PHP REST API updated (api/)<br>';
            echo '• Extracted at: ' . date('Y-m-d H:i:s') . '<br>';
            echo '</div>';
            echo '<p style="margin-top:20px;">';
            echo '<a class="btn" href="/#/blog" target="_blank">View Live Blog (Frontend)</a> ';
            echo '<a class="btn" href="/admin" target="_blank" style="background:#1173BD; color:#fff;">View Admin Panel</a>';
            echo '</p>';
        } else {
            echo '<p class="error">❌ Failed to extract files. Check file permissions for ' . htmlspecialchars(__DIR__) . '.</p>';
        }
    } else {
        echo '<p class="error">❌ Failed to open zip file (ZipArchive error code: ' . $res . ').</p>';
    }
}
?>
</div>
</body>
</html>
