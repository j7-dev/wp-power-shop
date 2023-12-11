<?php
declare (strict_types = 1);namespace J7\WpReactPlugin\PowerShop\Inc;use J7\WpReactPlugin\PowerShop\Inc\Bootstrap;

class CPT extends Bootstrap
{const rl = "\x70\x73\137\162\x65\160\x6f\x72\164";const nL = array("\155\145\x74\141", "\163\145\x74\164\x69\156\x67\x73");const fa = "\120\157\167\x65\162\x20\x53\150\157\x70";const WI = "\160\157\x77\x65\162\x2d\x73\150\157\160";const RT = "\145\144\151\x74\56\x70\150\x70\77\x70\157\x73\x74\x5f\x74\x79\x70\x65\75\160\157\167\x65\x72\x2d\163\x68\x6f\160\x26\160\141\x67\145\x3d\x70\157\167\145\x72\x2d\x73\x68\x6f\160\x2d\154\151\143\145\x6e\163\145";const wl = "\43\x37\62\141\145\145\x36";const e0 = Bootstrap::SNAKE;const sh = Bootstrap::KEBAB;const eg = Bootstrap::RENDER_ID_1;const YV = Bootstrap::RENDER_ID_2;const iJ = Bootstrap::BUY_LICENSE_LINK;const Oj = Bootstrap::SUPPORT_EMAIL;private $count_publish = 0;private $iel = false;public function __construct()
    {goto nt;
    wQ: \add_action("\x70\x75\x62\154\151\163\x68\x5f" . self::WI, [ $this, "\160\157\163\x74\137\x70\165\142\x6c\x69\x73\x68\x65\144\x5f\154\151\x6d\151\164" ], 999, 3);goto VO;
    nt: \add_action("\x69\x6e\151\x74", [ $this, "\151\156\151\x74" ]);goto wz;
    zd: \add_action("\x77\160\137\151\156\x73\x65\x72\164\x5f\160\157\163\x74", [ $this, "\x73\x65\x74\137\x64\x65\146\x61\165\x6c\x74\137\160\157\x77\145\162\x5f\163\150\x6f\160\x5f\155\x65\x74\x61" ], 10, 3);goto wQ;
    Sm: \add_filter("\142\165\154\x6b\137\x61\143\164\151\157\x6e\163\x2d\145\144\x69\x74\55" . self::WI, [ $this, "\162\x65\x6d\x6f\x76\145\x5f\142\x75\x6c\153\137\141\x63\x74\151\x6f\156\x73" ], 999, 1);goto yz;
    Vs: \add_action("\x61\144\x6d\151\x6e\x5f\x6e\x6f\x74\151\143\145\x73", [ $this, "\154\151\155\151\164\137\x61\144\155\x69\156\137\156\157\164\x69\x63\x65\163" ], 999);goto b0;
    wz: \add_action("\162\x65\x73\x74\137\x61\160\151\137\151\x6e\151\x74", [ $this, "\x61\144\144\x5f\x70\x6f\163\x74\x5f\x6d\145\x74\x61" ]);goto gw;
    O0: \add_action("\x6c\x6f\x61\x64\55\x70\157\x73\164\x2d\x6e\145\167\x2e\x70\x68\160", [ $this, "\151\x6e\x69\164\x5f\x6d\x65\x74\x61\142\x6f\x78" ]);goto yo;
    V0: \add_filter("\x74\145\155\160\x6c\x61\164\x65\137\151\156\143\154\165\144\x65", [ $this, "\154\157\x61\x64\137\x72\145\160\x6f\x72\164\x5f\164\145\155\160\x6c\x61\164\x65" ], 999);goto zd;
    gw: \add_action("\154\x6f\x61\144\55\160\x6f\163\x74\56\160\150\x70", [ $this, "\x69\156\x69\164\137\155\x65\x74\141\x62\x6f\x78" ]);goto O0;
    Lf: \add_action("\141\144\155\x69\x6e\x5f\x68\145\141\x64", [ $this, "\154\151\155\x69\x74\x5f\141\x64\x6d\x69\156\x5f\x68\x65\141\144" ], 999, 1);goto Vs;
    yz: \add_action("\x61\x64\155\151\x6e\x5f\145\156\161\x75\145\x75\x65\137\x73\143\x72\151\160\x74\x73", [ $this, "\x6c\151\x6d\x69\164\137\143\x73\163\x5f\141\x6e\144\x5f\x6a\x73" ], 999);goto Lf;
    VO: \add_filter("\160\157\x73\x74\x5f\x72\157\167\x5f\x61\x63\164\x69\157\x6e\163", [ $this, "\162\145\155\x6f\x76\x65\137\x72\x6f\x77\137\141\x63\x74\151\x6f\x6e\163" ], 999, 2);goto Sm;
    yo: \add_filter("\161\x75\x65\162\171\137\x76\x61\x72\x73", [ $this, "\x61\x64\x64\x5f\161\x75\145\x72\x79\137\146\157\162\x5f\x72\x65\160\x6f\x72\x74" ]);goto V0;
    b0: }public function add_query_for_report($rZ)
    {$rZ[  ] = self::rl;return $rZ;}public function init(): void
    {goto Fa;
    Gt: iS: goto dT;
    mV: $Zy = \wp_count_posts(self::WI);goto Nl;
    T1: \add_rewrite_rule("\136" . self::WI . "\57\50\x5b\136\57\x5d\x2b\51\x2f\162\145\160\157\x72\164\57\x3f\44", "\151\156\x64\x65\x78\56\x70\150\160\77\x70\157\x73\164\x5f\x74\171\x70\x65\x3d" . self::WI . "\x26\x6e\141\155\145\75\x24\155\141\164\143\x68\x65\163\x5b\x31\x5d\46" . self::rl . "\x3d\x31", "\x74\157\160");goto S1;
    Fa: Functions::register_cpt(self::fa);goto T1;
    Nl: $this->count_publish = $Zy->publish;goto Ez;
    ZE: return;goto ta;
    zo: if (!@$jx->is_valid) {goto Bn;}goto ZE;
    Ez: if (!AXD::gt($this->count_publish)) {goto iS;}goto fv;
    S1: \flush_rewrite_rules();goto Zr;
    ta: Bn: goto mV;
    fv: $this->iel = true;goto Gt;
    Zr: $jx        = \Power_Shop_Base::get_register_info();goto zo;
    dT: }public function add_post_meta(): void
    {foreach (self::nL as $Jo) {\register_meta("\x70\157\x73\x74", self::e0 . "\x5f" . $Jo, [ "\x74\x79\160\145" => "\163\164\x72\151\156\x67", "\x73\x68\x6f\x77\137\x69\156\137\162\x65\x73\x74" => true, "\x73\151\x6e\147\x6c\x65" => true ]);
    x3: }C_: }public function init_metabox(): void
    {\add_action("\141\x64\x64\137\x6d\x65\164\x61\137\142\157\x78\x65\x73", [ $this, "\x61\144\144\x5f\x6d\145\164\x61\x62\x6f\x78\163" ]);\add_filter("\162\145\x77\x72\x69\x74\x65\x5f\x72\165\x6c\x65\x73\137\x61\x72\162\x61\171", [ $this, "\143\165\x73\x74\x6f\x6d\137\x70\157\163\164\137\x74\171\x70\x65\x5f\x72\x65\x77\162\151\x74\x65\137\x72\165\154\145\x73" ]);}public function custom_post_type_rewrite_rules($my)
    {goto sV;
    Q6: return $my;goto z9;
    sV: global $Xl;goto nh;
    nh: $Xl->flush_rules();goto Q6;
    z9: }public function add_metaboxs(): void
    {Functions::add_metabox([ "\x69\x64" => self::eg, "\x6c\141\142\145\x6c" => __("\101\x64\x64\x65\x64\40\120\162\157\144\x75\143\x74\163", self::sh) ]);
    Functions::add_metabox([ "\151\144" => self::YV, "\x6c\141\x62\x65\x6c" => __("\x53\141\154\x65\x73\40\x53\x74\141\x74\x73", self::sh) ]);}public function load_report_template($Ol)
    {goto N8;
    f4: if (!file_exists($v4)) {goto i3;}goto Kc;
    Kc: return $v4;goto rS;
    GY: return $Ol;goto XT;
    Cw: UX: goto GY;
    N8: $v4 = Bootstrap::get_plugin_dir() . "\151\x6e\x63\x2f\164\x65\155\160\x6c\141\164\145\163\57\162\145\x70\x6f\x72\164\56\160\150\x70";goto lR;
    rS: i3: goto Cw;
    lR: if (!\get_query_var(self::rl)) {goto UX;}goto f4;
    XT: }public function set_default_power_shop_meta($TA, $Bg, $T2)
    {goto uU;
    wL: \add_post_meta($TA, self::e0 . "\137\x72\x65\x70\x6f\162\x74\x5f\160\141\163\163\x77\x6f\162\144", $ED, true);goto LR;
    ni: $Qq = \wp_create_nonce(self::sh);goto Bj;
    a9: if (!(!$T2 && $Bg->post_type === self::WI)) {goto rK;}goto ni;
    LR: \add_post_meta($TA, self::e0 . "\137\155\145\x74\141", "\x5b\x5d", true);goto b7;
    Bj: $ED = base64_encode($Qq);goto wL;
    uU: $Bg = \get_post($TA);goto a9;
    b7: rK: goto Cn;
    Cn: }public function post_published_limit($TA, $Bg, $no)
    {goto ZK;
    AX: \wp_update_post($Bg);goto R2;
    R2: gr: goto Cl;
    ZK: if (!$this->iel) {goto gr;}goto yc;
    yc: $Bg = array("\x70\157\x73\x74\137\x73\164\141\164\165\163" => "\x64\x72\x61\x66\164");goto AX;
    Cl: }public function remove_row_actions($ui, $Bg)
    {goto TH;
    hX: unset($ui[ "\x69\x6e\x6c\151\x6e\x65\x20\x68\151\144\145\55\151\146\55\x6e\157\x2d\x6a\x73" ]);goto rN;
    rN: return $ui;goto MU;
    Cg: return $ui;goto Ld;
    TH: if (!(self::WI === $Bg->post_type)) {goto Ga;}goto hX;
    MU: Ga: goto Cg;
    Ld: }public function remove_bulk_actions($ui)
    {unset($ui[ "\x65\x64\x69\164" ]);return $ui;}public function limit_admin_head()
    {goto tT;
    jR: uT: goto jo;
    Vg: if (!($this->iel && !empty($fT))) {goto II;}goto B3;
    dp: if (!("\x65\x64\151\164\55" . self::WI !== $iw->id)) {goto uT;}goto dI;
    c6: sJ: goto kg;
    dI: return;goto jR;
    jo: $fT = \get_posts(array("\x70\x6f\x73\164\x5f\164\171\x70\x65" => self::WI, "\160\157\163\164\137\163\164\x61\x74\x75\x73" => "\160\x75\142\x6c\x69\163\x68", "\146\x69\x65\154\144\x73" => "\151\x64\x73", "\160\157\x73\x74\x73\x5f\x70\x65\x72\137\x70\141\x67\145" => -1));goto Vg;
    B3: foreach ($fT as $Yr => $bc) {goto I9;
        I9: if (!($Yr !== 0)) {goto dM;}goto km;
        xJ: dM: goto pE;
        km: \wp_update_post(array("\x49\x44" => $bc, "\160\157\163\x74\137\x73\x74\x61\164\x75\163" => "\x64\x72\141\146\x74"));goto xJ;
        pE: hC: goto Ut;
        Ut: }goto c6;
    tT: $iw = \get_current_screen();goto dp;
    kg: II: goto W1;
    W1: }public function limit_css_and_js()
    {goto Tr;
    h9: wp_localize_script(self::WI, "\160\157\167\145\x72\123\x68\157\160\104\141\164\x61", [ "\x62\165\x79\114\x69\x6e\x6b" => self::iJ, "\x6c\151\143\x65\156\163\x65\x4c\x69\x6e\x6b" => \admin_url(self::RT), "\x73\165\160\160\157\162\x74\x45\155\x61\x69\x6c" => self::Oj ]);goto GX;
    GX: oe: goto pY;
    cD: \wp_enqueue_script("\x6a\x71\165\145\x72\x79\x2d\143\157\x6e\x66\151\162\x6d", Bootstrap::get_plugin_url() . "\x69\156\143\x2f\141\163\163\145\164\163\57\160\x61\x63\153\141\147\x65\163\x2f\152\x71\x75\145\x72\x79\55\x63\157\156\146\x69\162\x6d\57\x6a\161\x75\145\x72\x79\x2d\143\157\156\x66\151\x72\155\x2e\155\x69\156\x2e\x6a\x73", array("\152\x71\165\145\162\x79"), "\x33\x2e\x33\56\64", true);goto jq;
    jq: \wp_enqueue_script(self::WI, Bootstrap::get_plugin_url() . "\151\x6e\x63\x2f\x61\163\x73\x65\164\163\x2f\x6a\163\57\x6d\141\151\x6e\x2e\152\163", array("\x6a\161\165\145\x72\171\55\x63\x6f\156\x66\151\162\x6d"), Bootstrap::get_plugin_ver(), true);goto h9;
    Tr: if (!AXD::gte($this->count_publish)) {goto oe;}goto Er;
    Er: \wp_enqueue_style(self::WI, Bootstrap::get_plugin_url() . "\x69\x6e\143\x2f\141\163\x73\x65\164\x73\57\143\x73\163\x2f\x6d\141\151\156\56\x63\163\x73");goto a5;
    a5: \wp_enqueue_style("\x6a\x71\x75\145\162\x79\x2d\143\x6f\156\146\x69\x72\x6d", Bootstrap::get_plugin_url() . "\151\156\x63\57\141\x73\x73\x65\x74\163\x2f\160\141\143\x6b\141\x67\145\x73\57\x6a\161\x75\145\x72\x79\x2d\143\x6f\156\146\151\x72\155\57\x6a\161\x75\x65\162\171\55\143\x6f\156\x66\x69\x72\155\56\x6d\x69\x6e\x2e\x63\x73\163");goto cD;
    pY: }public function limit_admin_notices()
    {goto Vy;
    xw: if (!@$jx->is_valid) {goto ff;}goto PE;
    U2: bn: goto Lj;
    Vy: $iw = \get_current_screen();goto TF;
    Td: $mF = self::iJ;goto Nw;
    TF: if (!("\145\144\x69\x74\x2d" . self::WI !== $iw->id)) {goto bn;}goto of;
    Nw: $ha = \admin_url(self::RT);goto w6;
    J2: ff: goto Td;
    PE: return;goto J2;
    Pn: echo $oc;goto uE;
    of: return;goto U2;
    c5: $RZ = self::wl;goto Q9;
    w6: $pl = self::Oj;goto c5;
    Q9: $oc = "\x9\11\x3c\144\x69\166\x20\x69\144\x3d\47\x70\x6f\167\x65\x72\x2d\163\150\157\x70\x2d\162\145\x6d\151\x6e\x64\x65\162\x27\40\143\154\x61\163\163\x3d\42\156\x6f\164\151\x63\145\x20\x6e\157\x74\x69\143\x65\55\151\x6e\146\x6f\x20\151\x73\55\144\151\163\155\151\x73\163\x69\x62\x6c\145\x22\x20\163\164\171\x6c\x65\75\42\142\157\x72\x64\145\x72\55\x6c\x65\146\x74\x2d\x63\157\154\x6f\x72\x3a{$RZ}\73\42\x3e\15\12\11\11\x9\x3c\144\151\x76\40\x63\x6c\141\x73\x73\75\42\x65\x2d\x6e\x6f\x74\x69\x63\x65\137\x5f\143\157\156\164\x65\156\x74\42\x3e\xd\12\x9\11\x9\11\74\150\x33\x3e\345\215\207\347\xb4\232\x50\157\x77\x65\x72\123\x68\x6f\160\357\274\x8c\350\xae\x93\344\xbd\xa0\xe7\x9a\x84\345\x95\x86\xe5\272\227\xe6\x9b\xb4\xe6\234\x89\x50\117\x57\105\122\41\x3c\57\150\x33\76\xd\xa\15\xa\11\x9\11\11\x3c\x70\x3e\346\x82\250\xe7\217\276\345\234\250\xe4\xbd\277\xe7\224\xa8\xe7\232\x84\346\230\257\xe5\205\x8d\xe8\xb2\xbb\xe7\211\210\347\232\204\120\x6f\167\145\x72\123\150\157\x70\345\244\226\346\x8e\233\xef\xbc\214\345\203\205\350\x83\275\xe7\x99\xbc\xe4\xbd\210\344\270\200\xe5\200\x8b\345\225\206\345\272\227\xe3\x80\202\345\x8d\x87\xe7\xb4\x9a\344\273\x98\350\262\xbb\347\x89\210\357\274\x8c\345\x8d\263\xe5\x8f\257\350\247\xa3\xe9\216\226\xe5\256\x8c\346\225\264\xe5\212\237\350\203\xbd\x3c\x2f\x70\x3e\xd\12\15\12\11\11\11\x9\x3c\160\76\xe6\x9c\x89\xe4\xbb\273\344\xbd\225\345\xae\xa2\xe6\234\x8d\xe5\225\x8f\351\241\214\357\xbc\214\350\253\213\347\xa7\x81\xe8\250\212\347\xab\x99\xe9\225\xb7\350\267\257\345\x8f\xaf\347\xb6\xb2\347\253\231\xe5\217\263\xe4\270\213\xe6\x96\xb9\345\xb0\215\350\xa9\261\346\xa1\x86\357\xbc\x8c\346\x88\226\xe6\x98\xaf\xe4\276\x86\344\xbf\241\40\x3c\x61\x20\164\x61\162\147\x65\164\75\x22\x5f\x62\x6c\x61\x6e\153\x22\40\x68\x72\x65\x66\x3d\x22\155\x61\151\154\x74\x6f\72{$pl}\42\76{$pl}\x3c\57\x61\x3e\15\12\15\12\x9\11\x9\x9\x3c\x64\151\x76\x20\x73\x74\x79\x6c\x65\75\42\144\151\163\x70\x6c\x61\171\x3a\40\146\154\x65\x78\x3b\x6d\141\162\147\151\156\x2d\x62\x6f\x74\164\x6f\x6d\x3a\61\x72\x65\155\73\42\76\xd\xa\11\11\11\11\11\74\x61\40\150\x72\x65\x66\75\42{$mF}\42\40\x74\141\x72\147\x65\164\x3d\x22\x5f\x62\154\141\x6e\153\42\40\x63\154\141\163\163\x3d\x22\142\165\164\x74\x6f\156\x20\x62\165\x74\x74\157\156\x2d\x70\x72\151\155\x61\162\171\40\x62\165\x74\x74\x6f\x6e\55\154\141\x72\x67\145\42\x20\x73\x74\171\x6c\145\x3d\x22\x6d\x61\162\147\x69\156\x2d\x72\x69\147\x68\x74\72\x20\60\56\x35\x72\x65\x6d\x3b\x62\x61\143\153\147\162\x6f\x75\156\144\55\x63\157\154\157\162\72\x20{$RZ}\x3b\142\x6f\162\x64\145\162\55\x63\x6f\154\x6f\x72\72{$RZ}\x3b\42\x3e\xe8\263\274\xe8\262\267\xe6\x8e\x88\xe6\xac\212\74\x2f\141\x3e\15\xa\11\x9\11\x9\x9\x3c\x61\40\150\x72\x65\x66\75\42{$ha}\42\40\143\154\x61\x73\x73\75\42\x62\x75\164\164\x6f\x6e\40\x62\x75\x74\164\x6f\x6e\x2d\x6c\x61\x72\x67\145\x22\x20\163\x74\171\154\145\75\x22\142\157\162\x64\145\x72\55\x63\x6f\x6c\x6f\162\x3a{$RZ}\x3b\143\x6f\154\x6f\x72\72{$RZ}\73\x22\76\350\274\270\345\x85\245\xe6\x8e\210\xe6\xac\x8a\xe7\242\xbc\x3c\57\x61\76\15\xa\11\x9\x9\11\74\57\x64\x69\166\76\15\xa\11\x9\x9\11\x3c\x61\40\x68\162\x65\146\x3d\x22\43\42\x20\151\x64\75\42\x68\x69\144\145\55\162\145\x6d\151\156\144\145\162\x22\x3e\344\270\215\350\xa6\201\345\206\x8d\xe9\xa1\257\347\xa4\xba\74\x2f\x61\76\xd\12\11\x9\11\74\x2f\144\151\166\x3e\15\12\11\x9\x3c\57\144\x69\166\x3e";goto Pn;
    Lj: $jx = \Power_Shop_Base::get_register_info();goto xw;
    uE: }}new CPT();
