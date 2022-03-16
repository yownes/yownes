{*
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
 *}
 
<div id="root"></div>
  <script type="text/javascript">
    window.__YOWNES_STORE_INFO__ = {
      link: "{$siteUrl}",
      name: "{$shopName}"
    }
    window.__TOKEN__ = "token={$tokenYownes|escape:'html':'UTF-8'}"
  </script>
{foreach from=$scripts item=script}
  <script type="module" src="{$script}"></script>
{/foreach}
