<?php
/**
 * WAVZ CMS — Sitemap & Robots.txt Controller
 */

declare(strict_types=1);

class SitemapController
{
    public static function sitemap(): void
    {
        $db = getDB();
        $domain = 'https://wavz.com.eg';

        header('Content-Type: application/xml; charset=utf-8');

        $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

        $addUrl = function($loc, $priority = '0.8', $changefreq = 'weekly', $lastmod = null) use ($xml, $domain) {
            $url = $xml->addChild('url');
            $url->addChild('loc', htmlspecialchars($domain . $loc));
            $url->addChild('lastmod', $lastmod ? date('Y-m-d', strtotime($lastmod)) : date('Y-m-d'));
            $url->addChild('changefreq', $changefreq);
            $url->addChild('priority', $priority);
        };

        // Static Pages
        $addUrl('/', '1.0', 'daily');
        $addUrl('/#/about', '0.8', 'monthly');
        $addUrl('/#/journey', '0.7', 'monthly');
        $addUrl('/#/board', '0.7', 'monthly');
        $addUrl('/#/team', '0.7', 'monthly');
        $addUrl('/#/partners', '0.7', 'monthly');
        $addUrl('/#/news', '0.8', 'daily');
        $addUrl('/#/blog', '0.8', 'daily');
        $addUrl('/#/contact', '0.8', 'monthly');
        $addUrl('/#/savings-calculator', '0.7', 'monthly');

        // Service Pages
        $services = [
            '/#/managed-services',
            '/#/oracle-solutions',
            '/#/sap-services',
            '/#/data-ai',
            '/#/financial-services',
            '/#/payment-services',
            '/#/digital-transformation',
        ];
        foreach ($services as $svc) {
            $addUrl($svc, '0.9', 'weekly');
        }

        // Published News
        try {
            $newsStmt = $db->query("SELECT slug, updated_at FROM news_articles WHERE status = 'published'");
            while ($row = $newsStmt->fetch()) {
                $addUrl('/#/news/' . $row['slug'], '0.8', 'weekly', $row['updated_at']);
            }
        } catch (Throwable $e) {}

        // Published Blog Posts
        try {
            $blogStmt = $db->query("SELECT slug, updated_at FROM blog_posts WHERE status = 'published'");
            while ($row = $blogStmt->fetch()) {
                $addUrl('/#/blog/' . $row['slug'], '0.8', 'weekly', $row['updated_at']);
            }
        } catch (Throwable $e) {}

        echo $xml->asXML();
        exit;
    }

    public static function robots(): void
    {
        header('Content-Type: text/plain; charset=utf-8');

        $custom = '';
        try {
            $settings = Setting::getAllGrouped();
            $custom = $settings['system']['robots_txt_custom']['value_en'] ?? '';
        } catch (Throwable $e) {}

        if (!empty(trim($custom))) {
            echo trim($custom);
        } else {
            echo "User-agent: *\n";
            echo "Allow: /\n";
            echo "Disallow: /admin/\n";
            echo "Disallow: /api/\n\n";
            echo "Sitemap: https://wavz.com.eg/api/sitemap.xml\n";
        }
        exit;
    }
}
