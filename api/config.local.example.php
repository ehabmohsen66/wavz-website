<?php
/**
 * WAVZ CMS — Local Environment Overrides (cPanel)
 * 
 * Instructions:
 * 1. On your cPanel server (in public_html/api/), copy this file to config.local.php
 * 2. Replace the values below with your cPanel MySQL Database credentials.
 * 3. Keep config.local.php private.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_wavz_cms');
define('DB_USER', 'cpaneluser_dbuser');
define('DB_PASS', 'YourSecretDbPasswordHere');
define('JWT_SECRET', 'replace_with_a_random_64_char_key_for_jwt_token_signing');
define('APP_DEBUG', false);
