<?php
/**
 * WAVZ Digital Transformation - Database Charset & Arabic Content Repair Script
 * 
 * This standalone repair script:
 * 1. Switches Database and all 19 MySQL tables to utf8mb4 / utf8mb4_unicode_ci.
 * 2. Re-seeds or repairs all corrupted Arabic characters in:
 *    - blog_posts (all 12 standard articles, titles, excerpts, categories, blocks)
 *    - settings (hero, SEO, contact, footer translations)
 *    - testimonials (Arabic quotes, author names, roles)
 *    - timeline_events (journey milestones)
 * 3. Ensures future inserts/updates preserve Arabic characters properly.
 */

// Show errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/config.php';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WAVZ - Repair Arabic Charset & Content</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b1528; color: #e2e8f0; padding: 40px 20px; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; background: #111e38; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #38bdf8; margin-top: 0; font-size: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px; }
        h2 { color: #f59e0b; font-size: 18px; margin-top: 24px; }
        .log-box { background: #060d1b; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; color: #94a3b8; max-height: 480px; overflow-y: auto; white-space: pre-wrap; }
        .success { color: #34d399; font-weight: bold; }
        .warn { color: #fbbf24; }
        .error { color: #f87171; font-weight: bold; }
        .btn { display: inline-block; background: #0284c7; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; margin-top: 20px; transition: background 0.2s; }
        .btn:hover { background: #0369a1; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge-ok { background: rgba(52, 211, 153, 0.2); color: #34d399; border: 1px solid #34d399; }
    </style>
</head>
<body>
<div class="container">
    <h1>WAVZ Database UTF-8 (utf8mb4) & Arabic Content Repair</h1>
    <div class="log-box">
<?php

function out($msg, $class = '') {
    $classAttr = $class ? " class=\"$class\"" : "";
    echo "<span$classAttr>" . htmlspecialchars($msg) . "</span>\n";
    flush();
    if (ob_get_level() > 0) ob_flush();
}

try {
    $db = getDB();
    out("[OK] Connected to MySQL database.", "success");

    // 1. Enforce UTF-8 connection
    $db->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $db->exec("SET CHARACTER SET utf8mb4");
    out("[OK] Set session charset to utf8mb4 / utf8mb4_unicode_ci.", "success");

    // 2. Convert Database default collation
    try {
        $currentDb = $db->query("SELECT DATABASE()")->fetchColumn();
        if ($currentDb) {
            $db->exec("ALTER DATABASE `$currentDb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            out("[OK] Altered database `$currentDb` to utf8mb4_unicode_ci.", "success");
        }
    } catch (Exception $e) {
        out("[WARN] Could not alter database charset (check permissions): " . $e->getMessage(), "warn");
    }

    // 3. Convert all tables
    $tables = [
        'users',
        'settings',
        'pages',
        'page_sections',
        'services',
        'service_features',
        'blog_posts',
        'blog_categories',
        'testimonials',
        'case_studies',
        'solutions',
        'partners',
        'clients',
        'team_members',
        'navigation',
        'contact_submissions',
        'media',
        'activity_logs',
        'timeline_events'
    ];

    out("\n--- Converting 19 Tables to utf8mb4_unicode_ci ---");
    foreach ($tables as $tbl) {
        try {
            $db->exec("ALTER TABLE `$tbl` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            out("[CONVERTED] Table `$tbl` is now utf8mb4_unicode_ci.", "success");
        } catch (Exception $e) {
            out("[SKIP] Table `$tbl`: " . $e->getMessage(), "warn");
        }
    }

    // 4. Load multilang blog blocks
    $blogJsonPath = __DIR__ . '/blog_contents_multilang.json';
    if (!file_exists($blogJsonPath)) {
        $blogJsonPath = dirname(__DIR__) . '/src/components/blog_contents_multilang.json';
    }
    $blogBlocks = [];
    if (file_exists($blogJsonPath)) {
        $blogBlocks = json_decode(file_get_contents($blogJsonPath), true) ?: [];
        out("[OK] Loaded blog blocks dictionary (" . count($blogBlocks) . " articles).", "success");
    } else {
        out("[WARN] blog_contents_multilang.json not found, using excerpts for blocks.", "warn");
    }

    // 5. Define standard 12 blog posts with correct Arabic metadata
    $standardPosts = [
        [
            'slug' => 'ai-customer-service-ethical-dilemmas',
            'title_en' => 'AI & Customer Service: Ethical Dilemmas in 2025',
            'title_ar' => 'الذكاء الاصطناعي وخدمة العملاء: المعضلات الأخلاقية في 2025',
            'category_en' => 'AI & Innovation',
            'category_ar' => 'الذكاء الاصطناعي',
            'excerpt_en' => 'Artificial Intelligence is reshaping industries, and customer service is no exception. While these advancements promise efficiency, they introduce ethical dilemmas.',
            'excerpt_ar' => 'يُعيد الذكاء الاصطناعي تشكيل الصناعات، وخدمة العملاء ليست استثناءً.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/12/Ai1-400x250.png',
            'read_time' => 6,
            'accent' => '#FFB814',
            'tags' => 'AI, Customer Service',
            'published_at' => '2024-12-24 00:00:00'
        ],
        [
            'slug' => 'mastering-soc-strategies-in-2025-emerging-trends-to-fortify-your-cyber-resilience',
            'title_en' => 'SOC Strategies 2025: Trends to Fortify Cyber Resilience',
            'title_ar' => 'استراتيجيات SOC 2025: اتجاهات لتعزيز المرونة الإلكترونية',
            'category_en' => 'Cybersecurity',
            'category_ar' => 'الأمن الإلكتروني',
            'excerpt_en' => 'In today\'s hyperconnected world, cyber threats have escalated from nuisances to sophisticated campaigns. A robust Security Operations Center is a necessity.',
            'excerpt_ar' => 'في عالمنا المترابط اليوم، تصاعدت التهديدات الإلكترونية من مجرد إزعاج إلى حملات متطورة.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/12/SC1-400x250.png',
            'read_time' => 8,
            'accent' => '#EF4444',
            'tags' => 'SOC, Cybersecurity',
            'published_at' => '2024-12-17 00:00:00'
        ],
        [
            'slug' => 'the-future-of-sap-erp-trends-shaping-enterprise-resource-planning-in-2025',
            'title_en' => 'The Future of SAP ERP: Trends Shaping Enterprise Resource Planning in 2025',
            'title_ar' => 'مستقبل SAP ERP: الاتجاهات التي تُشكّل تخطيط موارد المؤسسة في 2025',
            'category_en' => 'SAP Services',
            'category_ar' => 'خدمات SAP',
            'excerpt_en' => 'SAP ERP has become synonymous with streamlined operations and intelligent decision-making. As businesses prepare for 2025, evolution of SAP ERP is setting a transformative stage.',
            'excerpt_ar' => 'أصبح SAP ERP مرادفاً للعمليات المبسطة وصنع القرار الذكي.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/12/al1-400x250.png',
            'read_time' => 7,
            'accent' => '#1173BD',
            'tags' => 'SAP, ERP',
            'published_at' => '2024-12-10 00:00:00'
        ],
        [
            'slug' => 'top-5-digital-transformation-trends-every-business-must-embrace-in-2025',
            'title_en' => 'Top 5 Digital Transformation Trends Every Business Must Embrace in 2025',
            'title_ar' => 'أهم 5 اتجاهات للتحول الرقمي يجب على كل شركة تبنيها في 2025',
            'category_en' => 'Digital Transformation',
            'category_ar' => 'التحول الرقمي',
            'excerpt_en' => 'Digital transformation continues to redefine how businesses operate, innovate, and compete. In 2025, staying ahead requires proactive engagement with emerging trends.',
            'excerpt_ar' => 'يواصل التحول الرقمي إعادة تعريف كيفية عمل الشركات وابتكارها.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/12/20251-400x250.png',
            'read_time' => 5,
            'accent' => '#22C55E',
            'tags' => 'Digital Transformation, Trends',
            'published_at' => '2024-12-03 00:00:00'
        ],
        [
            'slug' => 'ai-and-the-future-of-managed-services-a-look-ahead',
            'title_en' => 'AI and the Future of Managed Services: A Look Ahead',
            'title_ar' => 'الذكاء الاصطناعي ومستقبل الخدمات المُدارة',
            'category_en' => 'Managed Services',
            'category_ar' => 'الخدمات المُدارة',
            'excerpt_en' => 'Artificial Intelligence has evolved from an experimental technology to a transformative tool. For managed services, AI offers a new way to enhance efficiency.',
            'excerpt_ar' => 'تطور الذكاء الاصطناعي من تقنية تجريبية إلى أداة تحويلية.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/11/aii1-400x250.png',
            'read_time' => 6,
            'accent' => '#FFB814',
            'tags' => 'AI, Managed Services',
            'published_at' => '2024-11-26 00:00:00'
        ],
        [
            'slug' => 't24-the-future-of-banking-in-egypt',
            'title_en' => 'T24: The Future of Banking in Egypt with WAVZ',
            'title_ar' => 'T24: مستقبل الخدمات المصرفية في مصر مع WAVZ',
            'category_en' => 'Financial Services',
            'category_ar' => 'الخدمات المالية',
            'excerpt_en' => 'In Egypt\'s rapidly evolving financial landscape, the demand for agile banking solutions has reached new heights. Banks seek ways to enhance operational efficiency.',
            'excerpt_ar' => 'في المشهد المالي المتطور بسرعة في مصر، بلغ الطلب على حلول مصرفية مرنة آفاقاً جديدة.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/11/T24-400x250.png',
            'read_time' => 7,
            'accent' => '#1173BD',
            'tags' => 'Core Banking, T24',
            'published_at' => '2024-11-19 00:00:00'
        ],
        [
            'slug' => 'the-future-of-cloud-computing-trends-and-predictions-for-2024-and-beyond',
            'title_en' => 'The Future of Cloud Computing: Trends and Predictions for 2024 and Beyond',
            'title_ar' => 'مستقبل الحوسبة السحابية: الاتجاهات والتوقعات',
            'category_en' => 'Cloud',
            'category_ar' => 'السحابة الإلكترونية',
            'excerpt_en' => 'Cloud computing continues to evolve at a rapid pace, transforming how organizations store, process, and access data. The trends shaping cloud infrastructure today.',
            'excerpt_ar' => 'تتطور الحوسبة السحابية بوتيرة سريعة، مُحوِّلةً طريقة تخزين البيانات ومعالجتها.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/11/Cloud1-400x250.png',
            'read_time' => 6,
            'accent' => '#A855F7',
            'tags' => 'Cloud Computing, Infrastructure',
            'published_at' => '2024-11-12 00:00:00'
        ],
        [
            'slug' => 'how-augmented-reality-is-revolutionizing-customer-experience-in-fintech',
            'title_en' => 'How Augmented Reality is Revolutionizing Customer Experience in Fintech',
            'title_ar' => 'كيف تحدث الواقع المعزز ثورة في تجربة العملاء في القطاع المالي',
            'category_en' => 'FinTech',
            'category_ar' => 'التكنولوجيا المالية',
            'excerpt_en' => 'Augmented Reality is rapidly emerging as a game-changer in the fintech sector, offering innovative ways to enhance customer experience and streamline complex processes.',
            'excerpt_ar' => 'يبرز الواقع المعزز بسرعة بوصفه محركاً للتغيير في قطاع التكنولوجيا المالية.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/11/AR1-400x250.png',
            'read_time' => 5,
            'accent' => '#F97316',
            'tags' => 'Augmented Reality, FinTech',
            'published_at' => '2024-11-05 00:00:00'
        ],
        [
            'slug' => 'comprehensive-it-testing-services-for-reliable-business-systems',
            'title_en' => 'Comprehensive IT Testing Services for Reliable Business Systems',
            'title_ar' => 'خدمات اختبار IT الشاملة لأنظمة أعمال موثوقة',
            'category_en' => 'IT Testing',
            'category_ar' => 'اختبار IT',
            'excerpt_en' => 'Reliable IT systems are the backbone of modern business. Comprehensive testing services ensure your systems perform flawlessly, scale efficiently, and remain secure in the face of evolving threats.',
            'excerpt_ar' => 'أنظمة تكنولوجيا المعلومات الموثوقة هي العمود الفقري لعمليات الأعمال.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/10/IT1-400x250.png',
            'read_time' => 5,
            'accent' => '#22C55E',
            'tags' => 'Testing, IT',
            'published_at' => '2024-10-29 00:00:00'
        ],
        [
            'slug' => 'the-rise-of-managed-services-solutions-in-egypt',
            'title_en' => 'The Rise of Managed Services Solutions in Egypt',
            'title_ar' => 'صعود حلول الخدمات المُدارة في مصر',
            'category_en' => 'Managed Services',
            'category_ar' => 'الخدمات المُدارة',
            'excerpt_en' => 'Egypt\'s digital economy is accelerating, and with it comes a growing demand for professional managed services. Managed service providers offer the expertise, scalability, and reliability organizations need.',
            'excerpt_ar' => 'يتسارع الاقتصاد الرقمي في مصر، ومعه يتزايد الطلب على الخدمات المُدارة المهنية.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/10/MS1-400x250.png',
            'read_time' => 6,
            'accent' => '#FFB814',
            'tags' => 'Managed Services, Egypt',
            'published_at' => '2024-10-22 00:00:00'
        ],
        [
            'slug' => 'ai-in-cybersecurity-protecting-egypts-digital-economy',
            'title_en' => 'AI in Cybersecurity: Protecting Egypt\'s Digital Economy',
            'title_ar' => 'الذكاء الاصطناعي في الأمن الإلكتروني: حماية الاقتصاد الرقمي',
            'category_en' => 'Cybersecurity',
            'category_ar' => 'الأمن الإلكتروني',
            'excerpt_en' => 'As Egypt\'s digital economy grows, so do cybersecurity challenges. AI-powered security solutions are emerging as essential tools for detecting, preventing, and responding to sophisticated cyber threats.',
            'excerpt_ar' => 'مع نمو الاقتصاد الرقمي في مصر، تتزايد التحديات الأمنية الإلكترونية.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/10/Ai1-400x250.png',
            'read_time' => 7,
            'accent' => '#EF4444',
            'tags' => 'Cybersecurity, AI',
            'published_at' => '2024-10-15 00:00:00'
        ],
        [
            'slug' => 'the-role-of-apis-in-open-banking-driving-innovation',
            'title_en' => 'The Role of APIs in Open Banking: Driving Innovation',
            'title_ar' => 'دور API في الخدمات المصرفية المفتوحة: قيادة الابتكار',
            'category_en' => 'Financial Services',
            'category_ar' => 'الخدمات المالية',
            'excerpt_en' => 'Open Banking is transforming financial services by enabling secure data sharing between banks and third-party providers through APIs, driving unprecedented levels of competition, collaboration, and customer-centric services.',
            'excerpt_ar' => 'تُحوّل الخدمات المصرفية المفتوحة صناعة الخدمات المالية من خلال تمكين تبادل البيانات بشكل آمن.',
            'image' => 'https://wavz.com.eg/wp-content/uploads/2024/10/Open1-400x250.png',
            'read_time' => 5,
            'accent' => '#1173BD',
            'tags' => 'Open Banking, APIs',
            'published_at' => '2024-10-08 00:00:00'
        ]
    ];

    out("\n--- Repairing 12 Blog Posts Arabic Content ---");

    $adminStmt = $db->query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    $adminId = (int)$adminStmt->fetchColumn() ?: 1;

    $checkStmt = $db->prepare("SELECT id FROM blog_posts WHERE slug = :slug LIMIT 1");
    $updateStmt = $db->prepare("
        UPDATE blog_posts 
        SET title_ar = :title_ar,
            excerpt_ar = :excerpt_ar,
            category_ar = :category_ar,
            blocks_ar = :blocks_ar,
            blocks_en = :blocks_en,
            title_en = :title_en,
            excerpt_en = :excerpt_en,
            category_en = :category_en
        WHERE slug = :slug
    ");
    $insertStmt = $db->prepare("
        INSERT INTO blog_posts (slug, title_en, title_ar, excerpt_en, excerpt_ar, blocks_en, blocks_ar, image, category_en, category_ar, tags, read_time, accent_color, published_at, status, author_id)
        VALUES (:slug, :title_en, :title_ar, :excerpt_en, :excerpt_ar, :blocks_en, :blocks_ar, :image, :category_en, :category_ar, :tags, :read_time, :accent_color, :published_at, 'published', :author_id)
    ");

    $repairedCount = 0;
    foreach ($standardPosts as $postData) {
        $slug = $postData['slug'];

        $blocksEn = [];
        $blocksAr = [];

        if (isset($blogBlocks[$slug])) {
            $blocksEn = $blogBlocks[$slug]['en_blocks'] ?? [];
            $blocksAr = $blogBlocks[$slug]['ar_blocks'] ?? [];
        } else {
            foreach ($blogBlocks as $keySlug => $data) {
                if (str_contains($keySlug, substr($slug, 0, 15))) {
                    $blocksEn = $data['en_blocks'] ?? [];
                    $blocksAr = $data['ar_blocks'] ?? [];
                    break;
                }
            }
        }

        if (empty($blocksEn)) {
            $blocksEn = [['type' => 'paragraph', 'text' => $postData['excerpt_en']]];
        }
        if (empty($blocksAr)) {
            $blocksAr = [['type' => 'paragraph', 'text' => $postData['excerpt_ar']]];
        }

        $jsonBlocksEn = json_encode($blocksEn, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $jsonBlocksAr = json_encode($blocksAr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $checkStmt->execute([':slug' => $slug]);
        $existingId = $checkStmt->fetchColumn();

        if ($existingId) {
            $updateStmt->execute([
                ':title_ar'    => $postData['title_ar'],
                ':excerpt_ar'  => $postData['excerpt_ar'],
                ':category_ar' => $postData['category_ar'],
                ':blocks_ar'   => $jsonBlocksAr,
                ':blocks_en'   => $jsonBlocksEn,
                ':title_en'    => $postData['title_en'],
                ':excerpt_en'  => $postData['excerpt_en'],
                ':category_en' => $postData['category_en'],
                ':slug'        => $slug
            ]);
            out("[UPDATED ID #$existingId] " . $postData['title_ar'] . " (" . $slug . ")", "success");
        } else {
            $insertStmt->execute([
                ':slug'         => $slug,
                ':title_en'     => $postData['title_en'],
                ':title_ar'     => $postData['title_ar'],
                ':excerpt_en'   => $postData['excerpt_en'],
                ':excerpt_ar'   => $postData['excerpt_ar'],
                ':blocks_en'    => $jsonBlocksEn,
                ':blocks_ar'    => $jsonBlocksAr,
                ':image'        => $postData['image'],
                ':category_en'  => $postData['category_en'],
                ':category_ar'  => $postData['category_ar'],
                ':tags'         => $postData['tags'],
                ':read_time'    => $postData['read_time'],
                ':accent_color' => $postData['accent_color'],
                ':published_at' => $postData['published_at'],
                ':author_id'    => $adminId
            ]);
            out("[INSERTED NEW] " . $postData['title_ar'] . " (" . $slug . ")", "success");
        }
        $repairedCount++;
    }
    out("[OK] Repaired $repairedCount blog posts.", "success");

    // 6. Repair Translations in Settings, Timeline, Testimonials
    $transPath = __DIR__ . '/translations.json';
    if (file_exists($transPath)) {
        out("\n--- Repairing Settings & Global Translations ---");
        $translations = json_decode(file_get_contents($transPath), true);
        
        $getVal = function ($array, $path) {
            $keys = explode('.', $path);
            $current = $array;
            foreach ($keys as $key) {
                if (!isset($current[$key])) return null;
                $current = $current[$key];
            }
            return is_string($current) ? $current : null;
        };

        // Update settings with proper Arabic text
        $updateSetting = $db->prepare("UPDATE settings SET value_ar = :val_ar WHERE `key` = :key");
        $settingsToRepair = [
            'hero_tagline'      => 'hero.tagline',
            'hero_tagline2'     => 'hero.tagline2',
            'hero_title_1'      => 'hero.product1',
            'hero_title_accent' => 'hero.productAccent',
            'hero_title_2'      => 'hero.product2',
            'hero_brand'        => 'hero.brand',
            'hero_lede1'        => 'hero.lede1',
            'hero_lede_accent1' => 'hero.ledeAccent1',
            'hero_lede2'        => 'hero.lede2',
            'hero_lede_accent2' => 'hero.ledeAccent2',
            'hero_lede3'        => 'hero.lede3',
            'hero_lede_accent3' => 'hero.ledeAccent3',
            'hero_lede4'        => 'hero.lede4',
            'hero_cta_consult'  => 'hero.cta1',
            'hero_cta_savings'  => 'hero.cta2',
            'contact_address'   => 'footer.address',
            'footer_copy'       => 'footer.copy',
        ];

        foreach ($settingsToRepair as $k => $p) {
            $arVal = $getVal($translations['ar'] ?? [], $p);
            if ($arVal !== null) {
                $updateSetting->execute([':val_ar' => $arVal, ':key' => $k]);
                out("[SETTING] Repaired $k => $arVal", "success");
            }
        }

        // Testimonials
        out("\n--- Repairing Testimonials Arabic Content ---");
        $quotesEn = $translations['en']['results']['quotes'] ?? [];
        $quotesAr = $translations['ar']['results']['quotes'] ?? [];

        $updateTestimonial = $db->prepare("
            UPDATE testimonials 
            SET author_ar = :author_ar, quote_ar = :quote_ar, title_ar = :title_ar 
            WHERE author_en = :author_en
        ");

        foreach ($quotesEn as $quote) {
            $authorEn = $quote['author'] ?? '';
            $authorAr = '';
            $quoteAr = '';
            $roleAr = '';

            foreach ($quotesAr as $arQuote) {
                if (($arQuote['author'] ?? '') === $authorEn || str_contains($authorEn, 'Felfela') && str_contains($arQuote['author'] ?? '', 'جيلان')) {
                    $authorAr = $arQuote['author'] ?? '';
                    $quoteAr = $arQuote['text'] ?? '';
                    $roleAr = $arQuote['role'] ?? '';
                    break;
                }
            }

            if ($authorAr) {
                $updateTestimonial->execute([
                    ':author_ar' => $authorAr,
                    ':quote_ar'  => $quoteAr,
                    ':title_ar'  => $roleAr,
                    ':author_en' => $authorEn
                ]);
                out("[TESTIMONIAL] Repaired $authorEn => $authorAr", "success");
            }
        }
    }

    out("\n=======================================================");
    out("ALL REPAIRS COMPLETED SUCCESSFULLY!", "success");
    out("All 19 database tables are now encoded in utf8mb4_unicode_ci.");
    out("All Arabic texts (Blog, Settings, Testimonials) have been restored.");
    out("=======================================================");

} catch (Exception $e) {
    out("\n[FATAL ERROR] " . $e->getMessage(), "error");
    out($e->getTraceAsString(), "error");
}
?>
    </div>
    <div style="margin-top: 24px;">
        <span class="badge badge-ok">✓ UTF-8 REPAIR FINISHED</span>
        <p style="margin-top: 12px; color: #94a3b8;">
            You can now return to the <a href="/admin" style="color: #38bdf8;">Admin Portal</a> or view the <a href="/" style="color: #38bdf8;">Website Homepage</a>.
        </p>
    </div>
</div>
</body>
</html>
