<?php
/**
 * WAVZ CMS — Backup Controller
 * Generates and streams a full MySQL database dump for one-click admin download.
 */

declare(strict_types=1);

class BackupController
{
    public static function download(): void
    {
        $user = Auth::requireAdmin();

        $db = getDB();
        $tables = [];
        $stmt = $db->query('SHOW TABLES');
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }

        $filename = 'wavz_cms_backup_' . date('Y-m-d_His') . '.sql';

        header('Content-Type: application/sql; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');

        $out = fopen('php://output', 'w');

        fwrite($out, "-- ============================================================\n");
        fwrite($out, "-- WAVZ CMS — Full Database Backup\n");
        fwrite($out, "-- Generated: " . date('Y-m-d H:i:s') . "\n");
        fwrite($out, "-- By Admin: " . $user['name'] . " (" . $user['email'] . ")\n");
        fwrite($out, "-- ============================================================\n\n");
        fwrite($out, "SET FOREIGN_KEY_CHECKS=0;\n");
        fwrite($out, "SET NAMES utf8mb4;\n\n");

        foreach ($tables as $table) {
            // Table structure
            $createStmt = $db->query("SHOW CREATE TABLE `$table`")->fetch(PDO::FETCH_NUM);
            fwrite($out, "-- ------------------------------------------------------------\n");
            fwrite($out, "-- Structure for table `$table`\n");
            fwrite($out, "-- ------------------------------------------------------------\n");
            fwrite($out, "DROP TABLE IF EXISTS `$table`;\n");
            fwrite($out, $createStmt[1] . ";\n\n");

            // Table data
            $rows = $db->query("SELECT * FROM `$table`")->fetchAll(PDO::FETCH_ASSOC);
            if (!empty($rows)) {
                fwrite($out, "-- Data for table `$table` (" . count($rows) . " rows)\n");
                foreach ($rows as $row) {
                    $keys = array_map(fn($k) => "`$k`", array_keys($row));
                    $vals = array_map(function($v) use ($db) {
                        if ($v === null) return 'NULL';
                        return $db->quote((string)$v);
                    }, array_values($row));

                    fwrite($out, "INSERT INTO `$table` (" . implode(', ', $keys) . ") VALUES (" . implode(', ', $vals) . ");\n");
                }
                fwrite($out, "\n");
            }
        }

        fwrite($out, "SET FOREIGN_KEY_CHECKS=1;\n");
        fwrite($out, "-- End of backup\n");

        ActivityLog::log($user['id'], 'backup_download', 'database', 0, ['filename' => $filename]);

        fclose($out);
        exit;
    }
}
