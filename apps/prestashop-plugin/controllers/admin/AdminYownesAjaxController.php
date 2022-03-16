<?php
/**
 * 2019 (c) VueFront
 * 2020 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    VueFront, Yownes
 * @copyright Copyright (c) permanent, VueFront
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 * @version   0.1.0
 */

class AdminYownesAjaxController extends ModuleAdminController
{

    public function ajaxProcessVfTurnOff()
    {
        if (strpos($_SERVER["SERVER_SOFTWARE"], "Apache") !== false) {
            if (file_exists(_PS_ROOT_DIR_ . '/modules/yownes/.htaccess.txt')) {
                if(!is_writable(_PS_ROOT_DIR_ . '/.htaccess') || !is_writable(_PS_ROOT_DIR_ . '/modules/yownes/.htaccess.txt')) {

                    http_response_code(500);

                    die(Tools::jsonEncode(
                       array(
                         'error' => 'not_writable_htaccess'
                       )
                    ));
                }
                $content = file_get_contents(_PS_ROOT_DIR_ . '/modules/yownes/.htaccess.txt');
                file_put_contents(_PS_ROOT_DIR_ . '/.htaccess', $content);
                unlink(_PS_ROOT_DIR_ . '/modules/yownes/.htaccess.txt');
            }
        }

        $this->ajaxProcessVfInformation();
    }

    public function ajaxProcessVfAppsRemove() {
        $option = Configuration::get('yownes-apps');

        $setting = array();

        try {
            $setting = Tools::jsonDecode($option, true);
        } catch(Exception $e) {

        }
        unset($setting[$_POST['key']]);
        Configuration::updateValue('yownes-apps', Tools::jsonEncode($setting), null,0,0);
    }

    public function ajaxProcessVfAppsCreate() {
        
        $option = Configuration::get('yownes-apps');

        $setting = array();

        try {
            $setting = Tools::jsonDecode($option, true);
        } catch(Exception $e) {

        }

        $d = new DateTime();
            
        $setting[] = array(
            'codename' => $_POST['codename'],
            'jwt' => $_POST['jwt'],
            'dateAdded' => $d->format('Y-m-d\TH:i:s.u')
        );
    
        Configuration::updateValue('yownes-apps', Tools::jsonEncode($setting), null,0,0);

        die(
            Tools::jsonEncode(
                [
                'success' => 'success'
                ]
            )
          );
    }

    public function ajaxProcessVfApps() {
        $option = Configuration::get('yownes-apps');

        $setting = array();

        try {
            $setting = Tools::jsonDecode($option, true);
        } catch(Exception $e) {

        }
        die(
            Tools::jsonEncode(
                $setting
            )
          );
    }

    public function ajaxProcessVfTurnOn() {
        $catalog = Tools::getHttpHost(true). __PS_BASE_URI__;
        try {
        $catalog_url_info = parse_url($catalog);

        $catalog_path = $catalog_url_info['path'];

        $document_path = $catalog_path;
        if(!empty($_SERVER['DOCUMENT_ROOT'])) {
          $document_path = str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', realpath(_PS_ROOT_DIR_)) . '/';
        }

        if (strpos($_SERVER["SERVER_SOFTWARE"], "Apache") !== false) {

            if(!file_exists(_PS_ROOT_DIR_ . '/.htaccess')) {
                file_put_contents(_PS_ROOT_DIR_.'/.htaccess', "Options +FollowSymlinks
Options -Indexes
<FilesMatch \"(?i)((\.tpl|\.ini|\.log|(?<!robots)\.txt))\">
Require all denied
</FilesMatch>
RewriteEngine On
RewriteBase ".$catalog_path."
RewriteRule ^sitemap.xml$ index.php?route=extension/feed/google_sitemap [L]
RewriteRule ^googlebase.xml$ index.php?route=extension/feed/google_base [L]
RewriteRule ^system/download/(.*) index.php?route=error/not_found [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !.*\.(ico|gif|jpg|jpeg|png|js|css)
RewriteRule ^([^?]*) index.php?_route_=$1 [L,QSA]");
            }

            if(!is_writable(_PS_ROOT_DIR_ . '/.htaccess')) {
                http_response_code(500);
                die(Tools::jsonEncode(
                    array(
                        'error' => 'not_writable_htaccess'
                    )
                ));
            }

            if (file_exists(_PS_ROOT_DIR_ . '/.htaccess')) {
                $inserting = "# yownes scripts, styles and images
RewriteCond %{REQUEST_URI} .*(_nuxt)
RewriteCond %{REQUEST_URI} !.*/yownes/_nuxt
RewriteRule ^([^?]*) yownes/$1

# Yownes sw.js
RewriteCond %{REQUEST_URI} .*(sw.js)
RewriteCond %{REQUEST_URI} !.*/yownes/sw.js
RewriteRule ^([^?]*) yownes/$1

# Yownes favicon.ico
RewriteCond %{REQUEST_URI} .*(favicon.ico)
RewriteCond %{REQUEST_URI} !.*/yownes/favicon.ico
RewriteRule ^([^?]*) yownes/$1


# Yownes pages

# Yownes home page
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/index.html -f
RewriteRule ^$ yownes/index.html [L]

RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/index.html !-f
RewriteRule ^$ yownes/200.html [L]

# Yownes page if exists html file
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/$1.html -f
RewriteRule ^([^?]*) yownes/$1.html [L,QSA]

# Yownes page if not exists html file
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !.*(image|.php|admin|catalog|\/img\/.*\/|wp-json|wp-admin|wp-content|checkout|rest|static|order|themes\/|modules\/|js\/|\/yownes\/)
RewriteCond %{QUERY_STRING} !.*(rest_route)
RewriteCond %{DOCUMENT_ROOT}".$document_path."yownes/$1.html !-f
RewriteRule ^([^?]*) yownes/200.html [L,QSA]";

                $content = file_get_contents(_PS_ROOT_DIR_ . '/.htaccess');

                file_put_contents(_PS_ROOT_DIR_ . '/modules/yownes/.htaccess.txt', $content);

                preg_match('/# yownes pages/m', $content, $matches);

                if (count($matches) == 0) {
                    $content = preg_replace_callback('/#Domain:\s.*$/m', function ($matches) use ($inserting) {
                        return $matches[0] . PHP_EOL . $inserting . PHP_EOL;
                    }, $content);

                    file_put_contents(_PS_ROOT_DIR_ . '/.htaccess', $content);
                }
            }
        }
    } catch (\Exception $e) {
        echo $e->getMessage();
    }

    $this->ajaxProcessVfInformation();
  }

  public function ajaxProcessVfUpdate() {
    try {
      $tmpFile = tempnam(sys_get_temp_dir(), 'TMP_');
      rename($tmpFile, $tmpFile .= '.tar');
      file_put_contents($tmpFile, file_get_contents($_POST['url']));
      $this->removeDir(_PS_ROOT_DIR_ . '/yownes');
      $phar = new PharData($tmpFile);
      $phar->extractTo(_PS_ROOT_DIR_ . '/yownes');
    } catch (\Exception $e) {
        echo $e->getMessage();
    }

    $this->ajaxProcessVfInformation();
  }

  private function removeDir($dir)
  {
      if (is_dir($dir)) {
          $objects = scandir($dir);
          foreach ($objects as $object) {
              if ($object != "." && $object != "..") {
                  if (is_dir($dir . "/" . $object) && !is_link($dir . "/" . $object)) {
                      $this->removeDir($dir . "/" . $object);
                  } else {
                      unlink($dir . "/" . $object);
                  }
              }
          }
          rmdir($dir);
      }
  }

  public function ajaxProcessVfInformation() {
      $extensions = [];

      $moduleInstance = Module::getInstanceByName('yownes');

      if (Module::isInstalled('prestablog')) {
          $blogInstance = Module::getInstanceByName('prestablog');
          $extensions[] = [
              'name' => Module::getModuleName('prestablog'),
              'version' => $blogInstance->version,
              'status' => Module::isInstalled('prestablog')
          ];
      } else {
          $extensions[] = [
              'name' => Module::getModuleName('prestablog'),
              'version' => '',
              'status' => Module::isInstalled('prestablog')
          ];
      }

      $is_apache = strpos($_SERVER["SERVER_SOFTWARE"], "Apache") !== false;
      $status = false;
      if(file_exists(_PS_ROOT_DIR_.'/modules/yownes/.htaccess.txt')) {
          $status = true;
      }
      die(
        Tools::jsonEncode(
          [
            'apache' => $is_apache,
            'backup' => 'modules/yownes/.htaccess.txt',
            'htaccess' => file_exists(_PS_ROOT_DIR_ . '/.htaccess'),
            'status' => $status,
            'phpversion' => phpversion(),
            'plugin_version' => $moduleInstance->version,
            'extensions' => $extensions,
            'cmsConnect' => Tools::getHttpHost(true).
            __PS_BASE_URI__.'index.php?controller=graphql&module=yownes&fc=module',
            'server' => $_SERVER["SERVER_SOFTWARE"]
        ]
        )
      );
  }

  public function ajaxProcessProxy()
  {
    $body = Tools::file_get_contents('php://input');;
    if (!function_exists('getallheaders')) {
      function getallheaders()
      {
          $headers = [];
          foreach ($_SERVER as $name => $value) {
              if (substr($name, 0, 5) == 'HTTP_') {
                  $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
              }
          }
          return $headers;
      }
    }
    $headers = getallheaders();

    $cHeaders = array('Content-Type: application/json');

    if(!empty($headers['token'])) {
        $cHeaders[] = 'token: '.$headers['token'];
    }
    if(!empty($headers['Token'])) {
        $cHeaders[] = 'token: '.$headers['Token'];
    }
    if (!empty($headers['Authorization'])) {
        $cHeaders[] = 'Authorization: '.$headers['Authorization'];
    }
    if (!empty($headers['authorization'])) {
        $cHeaders[] = 'authorization: '.$headers['authorization'];
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:1337/graphql');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $cHeaders);
    $result = curl_exec($ch);
    curl_close($ch);
    die($result);
  }
}
