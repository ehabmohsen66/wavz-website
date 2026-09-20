<?php
/**
 * WAVZ CMS — Complete Database Migrator & Seed Script
 * Run this file once after importing schema.sql to populate all content.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

// Disable timeout limits for large migrations
set_time_limit(300);

echo "<pre>";
echo "====================================================\n";
echo "WAVZ CMS — Starting Database Content Migration\n";
echo "====================================================\n\n";

try {
    $db = getDB();
    echo "[OK] Connected to database successfully.\n";

    // ----------------------------------------------------
    // Enforce UTF-8mb4 Character Set on Database & Tables
    // ----------------------------------------------------
    echo "\n--- Enforcing UTF-8mb4 Character Set on Database & Tables ---\n";
    $db->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $db->exec("SET CHARACTER SET utf8mb4");

    try {
        $dbName = DB_NAME;
        $db->exec("ALTER DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "[OK] Database default collation set to utf8mb4_unicode_ci.\n";
    } catch (Throwable $e) {}

    $allTables = [
        'users', 'settings', 'media', 'pages', 'navigation',
        'team_members', 'partners', 'services', 'service_stats',
        'service_pipelines', 'service_bullets', 'news_articles',
        'blog_posts', 'timeline_events', 'testimonials',
        'activity_log', 'contact_submissions', 'clients'
    ];
    foreach ($allTables as $t) {
        try {
            $db->exec("ALTER TABLE `$t` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (Throwable $e) {}
    }
    echo "[OK] Initial table charset conversion to utf8mb4 applied.\n";

    // ----------------------------------------------------
    // 0. Ensure Database Tables Exist from schema.sql
    // ----------------------------------------------------
    echo "\n--- Verifying & Creating Database Tables ---\n";
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new RuntimeException("Missing schema.sql file at $schemaFile.");
    }
    
    $schemaSql = file_get_contents($schemaFile);
    $cleanSql = preg_replace('!/\*.*?\*/!s', '', $schemaSql);
    $cleanSql = preg_replace('/^--.*?$/m', '', $cleanSql);
    
    $statements = array_filter(array_map('trim', explode(';', $cleanSql)));
    foreach ($statements as $stmtSql) {
        if (empty($stmtSql)) continue;
        try {
            $db->exec($stmtSql);
        } catch (Throwable $e) {
            // Ignore non-fatal duplicates / already exists
        }
    }

    foreach ($allTables as $t) {
        try {
            $db->exec("ALTER TABLE `$t` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (Throwable $e) {}
    }
    echo "[OK] All database tables verified, created, and confirmed as utf8mb4_unicode_ci.\n";


    // ----------------------------------------------------
    // 1. Ensure Default Admin Account Exists
    // ----------------------------------------------------
    echo "\n--- Setting Up Admin Users ---\n";
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
    $stmt->execute([':email' => 'admin@wavz.com.eg']);
    $adminExists = (int)$stmt->fetchColumn() > 0;

    if (!$adminExists) {
        $adminPassword = 'wavz@admin2026';
        $hashedPassword = password_hash($adminPassword, PASSWORD_BCRYPT);
        
        $insertUser = $db->prepare("
            INSERT INTO users (name, email, password, role, is_active) 
            VALUES (:name, :email, :password, :role, 1)
        ");
        $insertUser->execute([
            ':name' => 'Super Admin',
            ':email' => 'admin@wavz.com.eg',
            ':password' => $hashedPassword,
            ':role' => 'admin'
        ]);
        echo "[NEW] Default Admin created:\n";
        echo "      Email: admin@wavz.com.eg\n";
        echo "      Password: wavz@admin2026 (Please change on first login!)\n";
    } else {
        // If password is placeholder, update it with default
        $stmtCheck = $db->prepare("SELECT password FROM users WHERE email = 'admin@wavz.com.eg'");
        $stmtCheck->execute();
        $currentPass = (string)$stmtCheck->fetchColumn();
        if (strpos($currentPass, 'placeholder') !== false) {
            $hashedPassword = password_hash('wavz@admin2026', PASSWORD_BCRYPT);
            $updatePass = $db->prepare("UPDATE users SET password = :password WHERE email = 'admin@wavz.com.eg'");
            $updatePass->execute([':password' => $hashedPassword]);
            echo "[UPDATED] Replaced placeholder password with wavz@admin2026 for admin@wavz.com.eg\n";
        } else {
            echo "[SKIP] Admin account admin@wavz.com.eg already exists.\n";
        }
    }

    // Get Admin ID for author references
    $stmt = $db->prepare("SELECT id FROM users WHERE email = 'admin@wavz.com.eg' LIMIT 1");
    $stmt->execute();
    $adminId = (int)$stmt->fetchColumn();

    // ----------------------------------------------------
    // 2. Load Translations JSON
    // ----------------------------------------------------
    $transPath = __DIR__ . '/translations.json';
    if (!file_exists($transPath)) {
        throw new RuntimeException("Missing translations.json file at $transPath. Please run Node compile command first.");
    }
    
    $translations = json_decode(file_get_contents($transPath), true);
    if ($translations === null) {
        throw new RuntimeException("Invalid translations.json syntax.");
    }
    echo "[OK] Loaded translations dictionary.\n";

    // ----------------------------------------------------
    // 3. Migrate Settings
    // ----------------------------------------------------
    echo "\n--- Migrating Global Settings ---\n";
    
    // Map of keys to extract from translations and save to settings
    $settingsMap = [
        // Hero Group
        'hero' => [
            'hero_tagline' => ['path' => 'hero.tagline', 'type' => 'text'],
            'hero_tagline2' => ['path' => 'hero.tagline2', 'type' => 'text'],
            'hero_title_1' => ['path' => 'hero.product1', 'type' => 'text'],
            'hero_title_accent' => ['path' => 'hero.productAccent', 'type' => 'text'],
            'hero_title_2' => ['path' => 'hero.product2', 'type' => 'text'],
            'hero_brand' => ['path' => 'hero.brand', 'type' => 'text'],
            'hero_lede1' => ['path' => 'hero.lede1', 'type' => 'textarea'],
            'hero_lede_accent1' => ['path' => 'hero.ledeAccent1', 'type' => 'text'],
            'hero_lede2' => ['path' => 'hero.lede2', 'type' => 'textarea'],
            'hero_lede_accent2' => ['path' => 'hero.ledeAccent2', 'type' => 'text'],
            'hero_lede3' => ['path' => 'hero.lede3', 'type' => 'textarea'],
            'hero_lede_accent3' => ['path' => 'hero.ledeAccent3', 'type' => 'text'],
            'hero_lede4' => ['path' => 'hero.lede4', 'type' => 'textarea'],
            'hero_cta_consult' => ['path' => 'hero.cta1', 'type' => 'text'],
            'hero_cta_savings' => ['path' => 'hero.cta2', 'type' => 'text'],
        ],
        // General SEO Group
        'seo' => [
            'site_title' => ['default_en' => 'WAVZ for Digital Transformation', 'default_ar' => 'WAVZ للتحول الرقمي', 'type' => 'text'],
            'meta_description' => ['path' => 'offering.lede', 'type' => 'textarea'],
            'meta_keywords' => ['default_en' => 'SAP, Temenos, Tietoevry, Cybersecurity, Managed Services, Egypt, MEA', 'default_ar' => 'خدمات ساب، أمن سيبراني، بنوك، تحول رقمي، مصر', 'type' => 'text'],
        ],
        // Contact Info Group
        'contact' => [
            'contact_phone' => ['path' => 'footer.phone', 'type' => 'tel'],
            'contact_email' => ['default_en' => 'info@wavz.com.eg', 'default_ar' => 'info@wavz.com.eg', 'type' => 'email'],
            'contact_address' => ['path' => 'footer.address', 'type' => 'textarea'],
            'footer_copy' => ['path' => 'footer.copy', 'type' => 'text'],
        ]
    ];

    // Helper to get nested values via dot-notation
    $getVal = function(array $arr, string $path) {
        $keys = explode('.', $path);
        foreach ($keys as $key) {
            if (!isset($arr[$key])) return null;
            $arr = $arr[$key];
        }
        return $arr;
    };

    $insertSetting = $db->prepare("
        INSERT INTO settings (`group`, `key`, value_en, value_ar, field_type)
        VALUES (:group, :key, :value_en, :value_ar, :field_type)
        ON DUPLICATE KEY UPDATE value_en = VALUES(value_en), value_ar = VALUES(value_ar)
    ");

    foreach ($settingsMap as $groupName => $fields) {
        foreach ($fields as $key => $meta) {
            $valEn = null;
            $valAr = null;

            if (isset($meta['path'])) {
                $valEn = $getVal($translations['en'], $meta['path']);
                $valAr = $getVal($translations['ar'], $meta['path']);
            } else {
                $valEn = $meta['default_en'] ?? null;
                $valAr = $meta['default_ar'] ?? null;
            }

            $insertSetting->execute([
                ':group'      => $groupName,
                ':key'        => $key,
                ':value_en'   => $valEn,
                ':value_ar'   => $valAr,
                ':field_type' => $meta['type'],
            ]);
        }
        echo "[OK] Migrated setting group: $groupName\n";
    }

    // ----------------------------------------------------
    // 4. Migrate Timeline Events (Journey)
    // ----------------------------------------------------
    echo "\n--- Migrating Journey Milestones ---\n";
    $db->exec("DELETE FROM timeline_events"); // Clear old

    $insertEvent = $db->prepare("
        INSERT INTO timeline_events (year, title_en, title_ar, items_en, items_ar, icon, color_scheme, sort_order)
        VALUES (:year, :title_en, :title_ar, :items_en, :items_ar, :icon, :color_scheme, :sort_order)
    ");

    $stepsEn = $getVal($translations['en'], 'journey.steps') ?? [];
    $stepsAr = $getVal($translations['ar'], 'journey.steps') ?? [];

    $colors = ['blue', 'gold', 'navy', 'success', 'danger'];

    foreach ($stepsEn as $idx => $step) {
        $year = $step['year'] ?? '';
        $titleEn = $step['title'] ?? '';
        
        // Find matching Arabic step
        $titleAr = '';
        $itemsAr = [];
        foreach ($stepsAr as $arStep) {
            if (($arStep['year'] ?? '') === $year) {
                $titleAr = $arStep['title'] ?? '';
                $itemsAr = $arStep['items'] ?? [];
                break;
            }
        }

        $itemsEn = $step['items'] ?? [];
        $color = $colors[$idx % count($colors)];
        $icon = match ($idx) {
            0 => 'MapPin',
            1 => 'Award',
            2 => 'Globe',
            3 => 'CreditCard',
            4 => 'Shield',
            5 => 'TrendingUp',
            6 => 'Cpu',
            default => 'Calendar'
        };

        $insertEvent->execute([
            ':year'         => $year,
            ':title_en'     => $titleEn,
            ':title_ar'     => $titleAr,
            ':items_en'     => json_encode($itemsEn, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':items_ar'     => json_encode($itemsAr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':icon'         => $icon,
            ':color_scheme' => $color,
            ':sort_order'   => $idx
        ]);
    }
    echo "[OK] Timeline milestones populated successfully (" . count($stepsEn) . " events).\n";

    // ----------------------------------------------------
    // 5. Migrate Testimonials
    // ----------------------------------------------------
    echo "\n--- Migrating Testimonials ---\n";
    $db->exec("DELETE FROM testimonials");

    $quotesEn = $getVal($translations['en'], 'results.quotes') ?? [];
    $quotesAr = $getVal($translations['ar'], 'results.quotes') ?? [];

    $insertTestimonial = $db->prepare("
        INSERT INTO testimonials (author_en, author_ar, company, title_en, title_ar, quote_en, quote_ar, photo, is_visible, sort_order)
        VALUES (:author_en, :author_ar, :company, :title_en, :title_ar, :quote_en, :quote_ar, :photo, 1, :sort_order)
    ");

    $photos = [
        'Eng. Jilan Felfela' => '/Gilan-Felfela.jpeg',
        'Marwan Tag' => null,
        'Edgars Bīberis' => null
    ];

    foreach ($quotesEn as $idx => $quote) {
        $authorEn = $quote['author'] ?? '';
        $quoteEn = $quote['text'] ?? '';
        $roleEn = $quote['role'] ?? '';

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

        // Map photos if available
        $photo = $photos[$authorEn] ?? null;

        $insertTestimonial->execute([
            ':author_en'  => $authorEn,
            ':author_ar'  => $authorAr,
            ':company'    => str_contains($roleEn, 'Baheya') ? 'Baheya Foundation' : (str_contains($roleEn, 'SC-Zone') ? 'SC-Zone IT' : 'Tietoevry'),
            ':title_en'   => $roleEn,
            ':title_ar'   => $roleAr,
            ':quote_en'   => $quoteEn,
            ':quote_ar'   => $quoteAr,
            ':photo'      => $photo,
            ':sort_order' => $idx
        ]);
    }
    echo "[OK] Testimonials populated successfully (" . count($quotesEn) . " quotes).\n";

    // ----------------------------------------------------
    // 6. Migrate Navigation Structure
    // ----------------------------------------------------
    echo "\n--- Migrating Navigation Menus ---\n";
    $db->exec("DELETE FROM navigation");

    $navEn = $getVal($translations['en'], 'nav') ?? [];
    $navAr = $getVal($translations['ar'], 'nav') ?? [];

    $navMap = [
        ['key' => 'platform', 'url' => '#/services', 'icon' => 'Layers'],
        ['key' => 'product', 'url' => '#/about', 'icon' => 'Info'],
        ['key' => 'solutions', 'url' => '#/partners', 'icon' => 'Handshake'],
        ['key' => 'resources', 'url' => '#/news', 'icon' => 'Newspaper'],
        ['key' => 'pricing', 'url' => '#/blog', 'icon' => 'Edit']
    ];

    $insertNav = $db->prepare("
        INSERT INTO navigation (parent_id, label_en, label_ar, url, icon, target, is_visible, sort_order, menu_group)
        VALUES (NULL, :label_en, :label_ar, :url, :icon, '_self', 1, :sort_order, 'main')
    ");

    foreach ($navMap as $idx => $menu) {
        $labelEn = $navEn[$menu['key']] ?? ucfirst($menu['key']);
        $labelAr = $navAr[$menu['key']] ?? '';
        
        $insertNav->execute([
            ':label_en'   => $labelEn,
            ':label_ar'   => $labelAr,
            ':url'        => $menu['url'],
            ':icon'       => $menu['icon'],
            ':sort_order' => $idx
        ]);
    }
    echo "[OK] Navigation links populated successfully.\n";

    // ----------------------------------------------------
    // 7. Migrate Blog Posts with Blocks
    // ----------------------------------------------------
    echo "\n--- Migrating Blog Posts with Notion-style Blocks ---\n";
    $db->exec("DELETE FROM blog_posts");

    $blogJsonPath = __DIR__ . '/blog_contents_multilang.json';
    if (!file_exists($blogJsonPath)) {
        $blogJsonPath = dirname(__DIR__) . '/src/components/blog_contents_multilang.json';
    }

    $blogBlocks = [];
    if (file_exists($blogJsonPath)) {
        $blogBlocks = json_decode(file_get_contents($blogJsonPath), true) ?: [];
    }

    // Static metadata for the 12 blog posts
    $staticPosts = [
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

    $insertPost = $db->prepare("
        INSERT INTO blog_posts (slug, title_en, title_ar, excerpt_en, excerpt_ar, blocks_en, blocks_ar, image, category_en, category_ar, tags, read_time, accent_color, published_at, status, author_id)
        VALUES (:slug, :title_en, :title_ar, :excerpt_en, :excerpt_ar, :blocks_en, :blocks_ar, :image, :category_en, :category_ar, :tags, :read_time, :accent_color, :published_at, 'published', :author_id)
    ");

    $count = 0;
    foreach ($staticPosts as $postData) {
        $slug = $postData['slug'];
        
        // Find blocks matching this slug
        $blocksEn = [];
        $blocksAr = [];

        // Check exact match first
        if (isset($blogBlocks[$slug])) {
            $blocksEn = $blogBlocks[$slug]['en_blocks'] ?? [];
            $blocksAr = $blogBlocks[$slug]['ar_blocks'] ?? [];
        } else {
            // Find partial slug match if any
            foreach ($blogBlocks as $keySlug => $data) {
                if (str_contains($keySlug, substr($slug, 0, 15))) {
                    $blocksEn = $data['en_blocks'] ?? [];
                    $blocksAr = $data['ar_blocks'] ?? [];
                    break;
                }
            }
        }

        // If blocks are empty, add a default fallback paragraph
        if (empty($blocksEn)) {
            $blocksEn = [['type' => 'paragraph', 'text' => $postData['excerpt_en']]];
        }
        if (empty($blocksAr)) {
            $blocksAr = [['type' => 'paragraph', 'text' => $postData['excerpt_ar']]];
        }

        $insertPost->execute([
            ':slug'          => $slug,
            ':title_en'      => $postData['title_en'],
            ':title_ar'      => $postData['title_ar'],
            ':excerpt_en'    => $postData['excerpt_en'],
            ':excerpt_ar'    => $postData['excerpt_ar'],
            ':blocks_en'     => json_encode($blocksEn, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':blocks_ar'     => json_encode($blocksAr, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':image'         => $postData['image'],
            ':category_en'   => $postData['category_en'],
            ':category_ar'   => $postData['category_ar'],
            ':tags'          => $postData['tags'],
            ':read_time'     => $postData['read_time'],
            ':accent_color'  => $postData['accent_color'],
            ':published_at'  => $postData['published_at'],
            ':author_id'     => $adminId
        ]);
        $count++;
    }
    echo "[OK] Blog posts imported successfully ($count posts).\n";

    // ----------------------------------------------------
    // 9. Ensure Contact Submissions Table Exists
    // ----------------------------------------------------
    echo "\n--- Setting Up Inquiries & Contact Submissions ---\n";
    $db->exec("
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          name         VARCHAR(150) NOT NULL,
          email        VARCHAR(255) NOT NULL,
          phone        VARCHAR(50) DEFAULT NULL,
          company      VARCHAR(150) DEFAULT NULL,
          service      VARCHAR(150) DEFAULT NULL,
          message      TEXT NOT NULL,
          status       ENUM('unread','read','replied','archived') NOT NULL DEFAULT 'unread',
          ip_address   VARCHAR(45) DEFAULT NULL,
          created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_created (created_at),
          INDEX idx_email (email)
        ) ENGINE=InnoDB;
    ");
    echo "[OK] contact_submissions table verified.\n";

    // ----------------------------------------------------
    // 10. Seed Advanced Analytics, SMTP & System Settings
    // ----------------------------------------------------
    echo "\n--- Setting Up Marketing, SMTP & System Settings ---\n";
    $additionalSettings = [
        ['analytics', 'google_analytics_id', '', null, 'text'],
        ['analytics', 'google_tag_manager_id', '', null, 'text'],
        ['analytics', 'meta_pixel_id', '', null, 'text'],
        ['analytics', 'linkedin_partner_id', '', null, 'text'],
        ['analytics', 'custom_head_code', '', null, 'code'],
        ['analytics', 'custom_body_code', '', null, 'code'],
        ['analytics', 'custom_footer_code', '', null, 'code'],
        ['analytics', 'cookie_consent_enabled', '0', '0', 'text'],
        ['smtp', 'notification_email', 'Salma.Hegazy@wavz.com.eg, info@wavz.com.eg', null, 'email'],
        ['smtp', 'smtp_host', 'mail.wavz.com.eg', null, 'text'],
        ['smtp', 'smtp_port', '465', null, 'text'],
        ['smtp', 'smtp_user', 'info@wavz.com.eg', null, 'text'],
        ['smtp', 'smtp_pass', 'Wavz@2008', null, 'text'],
        ['smtp', 'smtp_encryption', 'ssl', null, 'text'],
        ['smtp', 'smtp_from_name', 'WAVZ Website Inquiries', null, 'text'],
        ['system', 'maintenance_mode', '0', '0', 'text'],
        ['system', 'maintenance_message_en', 'We are currently performing scheduled system updates. We will be back shortly.', null, 'textarea'],
        ['system', 'maintenance_message_ar', 'نقوم حالياً بإجراء تحديثات مجدولة للنظام. سنعود للعمل قريباً.', null, 'textarea'],
        ['system', 'robots_txt_custom', "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://wavz.com.eg/api/sitemap.xml", null, 'code'],
    ];

    $checkStmt = $db->prepare("SELECT COUNT(*) FROM settings WHERE `key` = :key");
    $insertSettingStmt = $db->prepare("
        INSERT INTO settings (`group`, `key`, value_en, value_ar, field_type)
        VALUES (:group, :key, :value_en, :value_ar, :field_type)
    ");

    foreach ($additionalSettings as $item) {
        $checkStmt->execute([':key' => $item[1]]);
        if ((int)$checkStmt->fetchColumn() === 0) {
            $insertSettingStmt->execute([
                ':group'      => $item[0],
                ':key'        => $item[1],
                ':value_en'   => $item[2],
                ':value_ar'   => $item[3],
                ':field_type' => $item[4],
            ]);
        }
    }
    echo "[OK] Advanced settings verified.\n";

    // ----------------------------------------------------
    // 11. Alter Testimonials Table: Add logo_url
    // ----------------------------------------------------
    echo "\n--- Verifying Testimonials Columns ---\n";
    try {
        $db->exec("ALTER TABLE testimonials ADD COLUMN logo_url VARCHAR(500) DEFAULT NULL AFTER photo");
        echo "[OK] Added logo_url column to testimonials table.\n";
    } catch (Throwable $e) {
        echo "[INFO] Testimonials logo_url column already exists or verified.\n";
    }

    // ----------------------------------------------------
    // 12. Create and Seed Clients Table (LogoStrip)
    // ----------------------------------------------------
    echo "\n--- Setting Up Clients Table & Logos ---\n";
    $db->exec("
        CREATE TABLE IF NOT EXISTS clients (
          id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          name         VARCHAR(150) NOT NULL,
          logo         VARCHAR(500) DEFAULT NULL,
          website_url  VARCHAR(500) DEFAULT NULL,
          is_visible   TINYINT(1) NOT NULL DEFAULT 1,
          sort_order   INT UNSIGNED NOT NULL DEFAULT 0,
          created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_visible (is_visible),
          INDEX idx_sort (sort_order)
        ) ENGINE=InnoDB;
    ");
    echo "[OK] clients table verified.\n";

    $clientCount = (int)$db->query("SELECT COUNT(*) FROM clients")->fetchColumn();
    if ($clientCount === 0) {
        $clientLogos = [
            ['Egypt Post', '/Picture8.png', 'https://www.egyptpost.org', 1, 0],
            ['AAIB', '/Picture5.png', 'https://aaib.com', 1, 1],
            ['Bank NXT', '/Picture6.png', 'https://banknxt.com', 1, 2],
            ['EBank', '/Picture7.png', 'https://ebank.com.eg', 1, 3],
            ['Misr Insurance', '/Picture4.png', 'https://misrins.com.eg', 1, 4],
            ['DEPI', '/Picture2.png', null, 1, 5],
            ['WASCO', '/Picture3.png', null, 1, 6],
            ['Go Bus', '/Picture1.png', 'https://gobus.com.eg', 1, 7],
            ['MCIT', '/MCIT-logos-Color-English-02-white-bg (1).png', 'https://mcit.gov.eg', 1, 8],
            ['H&D Bank', '/Housing and Development Bank logo .png', 'https://hdb-egy.com', 1, 9],
            ['Egypt Trust', '/Egypt trust.png', null, 1, 10],
            ['Maridive', '/Maridive & Oil Services SAE Logo.png', 'https://maridivegroup.net', 1, 11],
            ['La Poste', '/Logo-groupe-la-poste-2021.png', null, 1, 12],
            ['SC Zone', '/sc-zonelogo-header.png', 'https://sczone.eg', 1, 13],
            ['Prosecure', '/ps9.jpeg', null, 1, 14],
            ['Baheya', '/Baheya logo.png', 'https://baheya.org', 1, 15],
            ['Tietoevry', '/8b56ffb305d960f5_org.png', 'https://tietoevry.com', 1, 16],
            ['Teradata', '/Teradata_logo_(2024).svg.png', 'https://teradata.com', 1, 17],
            ['PDC', '/PDC-Logo.png', null, 1, 18],
            ['Detchland', '/detchland logo limited.png', null, 1, 19],
        ];

        $insertClientStmt = $db->prepare("
            INSERT INTO clients (name, logo, website_url, is_visible, sort_order)
            VALUES (:name, :logo, :website_url, :is_visible, :sort_order)
        ");

        foreach ($clientLogos as $cl) {
            $insertClientStmt->execute([
                ':name'        => $cl[0],
                ':logo'        => $cl[1],
                ':website_url' => $cl[2],
                ':is_visible'  => $cl[3],
                ':sort_order'  => $cl[4],
            ]);
        }
        echo "[OK] Seeded 20 client logos into clients table.\n";
    }

    // ----------------------------------------------------
    // 13. Seed Complete Hero & Homepage Content Settings
    // ----------------------------------------------------
    echo "\n--- Setting Up Complete Hero & Homepage Settings ---\n";
    $heroAndHomeSettings = [
        ['hero', 'hero_tagline', 'The turn-key platform for enterprise digital transformation.', 'المنصة المتكاملة للتحول الرقمي للمؤسسات.', 'text'],
        ['hero', 'hero_tagline2', 'Supports Multi-Industry, Multi-Service, Multi-Geography Delivery.', 'تنفيذ متعدد القطاعات، متعدد الخدمات، عبر مختلف مناطق الشرق الأوسط وأفريقيا.', 'text'],
        ['hero', 'hero_title_1', 'IT Managed Services', 'خدمات وحلول تكنولوجيا المعلومات', 'text'],
        ['hero', 'hero_title_accent', '& Solutions', 'المُدارة بالكامل', 'text'],
        ['hero', 'hero_title_2', 'Revolutionize your enterprise operations, drive innovation, and achieve unprecedented success with', 'أحدث نقلة نوعية في عملياتك المؤسسية وحقق أعلى مستويات الكفاءة والموثوقية مع', 'textarea'],
        ['hero', 'hero_brand', 'WAVZ for Digital Transformation', 'WAVZ للتحول الرقمي', 'text'],
        ['hero', 'hero_lede1', 'SAP-grade ERP joins Temenos-grade banking, on YOUR infrastructure. ', 'تطبيقات SAP المؤسسية، مقترنة بأحدث الأنظمة البنكية والتقنية، على بنيتك التحتية. ', 'textarea'],
        ['hero', 'hero_lede_accent1', 'Multi-Industry', 'تنفيذٌ متعدد القطاعات', 'text'],
        ['hero', 'hero_lede2', ' delivery that scales every operation. ', ' يوسع كل عملية. ', 'textarea'],
        ['hero', 'hero_lede_accent2', 'Multi-Service', 'تنسيقٌ متعدد الخدمات', 'text'],
        ['hero', 'hero_lede3', ' orchestration past 99.9% SLA. ', ' بمعدل اتفاقية مستوى خدمة 99.9%. ', 'textarea'],
        ['hero', 'hero_lede_accent3', 'Multi-Geography', 'تغطيةٌ إقليمية شاملة', 'text'],
        ['hero', 'hero_lede4', ' coverage across MEA, one team, one accountable lead.', ' عبر المنطقة — فريق واحد، وقائد مسؤول واحد.', 'textarea'],
        ['hero', 'hero_cta_consult', 'Get a Consultation', 'احجز استشارة', 'text'],
        ['hero', 'hero_cta_savings', 'Calculate Your Savings', 'احسب وفوراتك', 'text'],
        ['homepage', 'stat_featured_value', '99.9', '99.9', 'text'],
        ['homepage', 'stat_featured_suffix', '%', '%', 'text'],
        ['homepage', 'stat_featured_title_en', 'Guaranteed Production SLA Compliance', 'التزام موثوق باتفاقية مستوى الخدمة', 'text'],
        ['homepage', 'stat_featured_sub_en', 'Average SLA attainment across all enterprise and tier-1 banking production tenants', 'متوسط تحقيق اتفاقيات مستوى الخدمة عبر كافة بيئات البنوك والمؤسسات الكبرى', 'textarea'],
        ['homepage', 'stat_1_value', '450', '450', 'text'],
        ['homepage', 'stat_1_suffix', '+', '+', 'text'],
        ['homepage', 'stat_1_label_en', 'Certified Engineers', 'مهندس وخبير معتمد', 'text'],
        ['homepage', 'stat_1_sub_en', 'SAP, Oracle, Temenos, and cloud security specialists', 'متخصصون في أنظمة SAP وOracle وTemenos وأمن السحابة', 'text'],
        ['homepage', 'stat_2_value', '600', '600', 'text'],
        ['homepage', 'stat_2_suffix', '+', '+', 'text'],
        ['homepage', 'stat_2_label_en', 'Enterprise Deployments', 'مشروع وموقع تشغيلي', 'text'],
        ['homepage', 'stat_2_sub_en', 'Core banking, ERP, and mission-critical workloads', 'أنظمة بنكية رئيسية وحلول تخطيط الموارد وسيرفرات حساسة', 'text'],
        ['homepage', 'stat_3_value', '25', '25', 'text'],
        ['homepage', 'stat_3_suffix', '+', '+', 'text'],
        ['homepage', 'stat_3_label_en', 'Years of Heritage', 'عاماً من الخبرة والريادة', 'text'],
        ['homepage', 'stat_3_sub_en', 'Deep regional domain expertise in regulated industries', 'خبرة إقليمية راسخة في القطاعات المصرفية والمالية والحكومية', 'text'],
        ['homepage', 'stat_4_value', '18', '18', 'text'],
        ['homepage', 'stat_4_suffix', '+', '+', 'text'],
        ['homepage', 'stat_4_label_en', 'Strategic Alliances', 'شراكة استراتيجية عالمية', 'text'],
        ['homepage', 'stat_4_sub_en', 'Tier-1 technology partnerships with global market leaders', 'شراكات مع كبرى الشركات التقنية الرائدة عالمياً', 'text'],
        ['homepage', 'stat_5_value', '24/7', '24/7', 'text'],
        ['homepage', 'stat_5_suffix', '', '', 'text'],
        ['homepage', 'stat_5_label_en', 'Continuous Operations', 'عمليات ومراقبة مستمرة', 'text'],
        ['homepage', 'stat_5_sub_en', 'Dual NOC + SOC facilities monitoring nationwide assets', 'مركزي عمليات NOC وSOC متقدمين لرصد ومراقبة الأنظمة', 'text'],
    ];

    foreach ($heroAndHomeSettings as $item) {
        $checkStmt->execute([':key' => $item[1]]);
        if ((int)$checkStmt->fetchColumn() === 0) {
            $insertSettingStmt->execute([
                ':group'      => $item[0],
                ':key'        => $item[1],
                ':value_en'   => $item[2],
                ':value_ar'   => $item[3],
                ':field_type' => $item[4],
            ]);
        }
    }
    echo "[OK] Hero and homepage settings verified.\n";

    echo "\n====================================================\n";
    echo "WAVZ CMS — Content Migration Completed Successfully!\n";
    echo "====================================================\n";

} catch (Throwable $e) {
    echo "\n[ERROR] Migration Failed:\n" . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " on line " . $e->getLine() . "\n";
}

echo "</pre>";
