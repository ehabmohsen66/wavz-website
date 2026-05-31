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
        echo "[SKIP] Admin account admin@wavz.com.eg already exists.\n";
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
            ':items_en'     => json_encode($itemsEn),
            ':items_ar'     => json_encode($itemsAr),
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

    $blogJsonPath = '/Users/ihabmohamed/wavz-website/src/components/blog_contents_multilang.json';
    if (!file_exists($blogJsonPath)) {
        throw new RuntimeException("Missing blog contents JSON file at $blogJsonPath.");
    }

    $blogBlocks = json_decode(file_get_contents($blogJsonPath), true);
    if ($blogBlocks === null) {
        throw new RuntimeException("Invalid blog_contents_multilang.json syntax.");
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
            ':blocks_en'     => json_encode($blocksEn),
            ':blocks_ar'     => json_encode($blocksAr),
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

    echo "\n====================================================\n";
    echo "WAVZ CMS — Content Migration Completed Successfully!\n";
    echo "====================================================\n";

} catch (Throwable $e) {
    echo "\n[ERROR] Migration Failed:\n" . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " on line " . $e->getLine() . "\n";
}

echo "</pre>";
