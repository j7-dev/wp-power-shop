<?php 
declare (strict_types=1); namespace J7\ViteReactWPPlugin\PowerShop\Admin; use J7\ViteReactWPPlugin\PowerShop\Admin\Bootstrap; class CPT extends Bootstrap { const Cf = "\160\163\x5f\x72\x65\160\x6f\162\164"; const zR = array("\155\145\x74\141", "\x73\145\164\x74\151\156\147\163"); const Gm = "\120\157\167\x65\x72\40\x53\x68\x6f\160"; const BL = "\160\x6f\x77\145\x72\55\x73\150\x6f\x70"; const rt = "\x65\144\151\164\x2e\x70\x68\160\77\x70\157\163\164\137\164\171\160\x65\75\160\x6f\167\x65\162\x2d\x73\x68\x6f\x70\46\160\141\x67\x65\75\160\x6f\x77\x65\162\x2d\163\150\157\x70\x2d\x6c\x69\143\x65\x6e\x73\x65"; const tJ = "\x23\x37\x32\x61\145\x65\x36"; private $count_publish = 0; private $iel = false; function __construct() { goto C2; eC: \add_action("\167\x70\x5f\x69\156\163\145\162\x74\x5f\x70\157\163\164", [$this, "\163\x65\164\x5f\x64\x65\x66\141\x75\154\x74\x5f\160\x6f\x77\145\162\x5f\x73\150\x6f\x70\137\155\145\164\141"], 10, 3); goto Ri; Lp: \add_filter("\x70\157\163\164\137\x72\157\x77\x5f\x61\x63\x74\x69\x6f\156\163", [$this, "\x72\x65\x6d\x6f\x76\x65\137\162\157\167\x5f\141\x63\164\x69\157\156\163"], 999, 2); goto L_; Eq: \add_action("\x61\144\x6d\151\x6e\x5f\150\x65\x61\144", [$this, "\x6c\151\155\x69\164\x5f\x61\x64\x6d\x69\156\x5f\x68\x65\x61\x64"], 999, 1); goto gb; vP: \add_action("\154\x6f\141\144\x2d\160\x6f\x73\x74\x2e\x70\x68\160", [$this, "\x69\156\x69\164\137\155\x65\x74\141\142\x6f\x78"]); goto OV; Ri: \add_action("\160\165\142\154\x69\x73\x68\137" . self::BL, [$this, "\x70\x6f\163\164\137\160\165\142\154\151\163\x68\x65\x64\137\x6c\151\155\x69\164"], 999, 3); goto Lp; gb: \add_action("\x61\x64\155\x69\156\137\156\x6f\164\151\143\x65\x73", [$this, "\x6c\151\x6d\x69\x74\137\x61\144\x6d\x69\156\x5f\x6e\157\164\151\143\x65\163"], 999); goto ui; fx: \add_filter("\x74\145\155\x70\x6c\x61\x74\145\x5f\x69\156\143\154\165\x64\x65", [$this, "\x6c\157\141\x64\137\162\x65\160\157\x72\164\x5f\164\x65\155\x70\x6c\x61\x74\x65"], 999); goto eC; gI: \add_action("\141\144\155\x69\x6e\x5f\145\x6e\x71\165\x65\x75\145\x5f\163\143\x72\151\160\x74\x73", [$this, "\x6c\151\155\x69\x74\137\143\x73\163\x5f\x61\156\144\x5f\152\163"], 999); goto Eq; jl: \add_action("\x72\145\x73\x74\137\141\x70\x69\137\151\156\151\x74", [$this, "\x61\x64\144\137\x70\x6f\x73\164\x5f\155\145\164\141"]); goto vP; OV: \add_action("\x6c\157\x61\x64\x2d\160\x6f\163\164\55\156\145\167\x2e\160\x68\x70", [$this, "\x69\156\151\x74\x5f\155\x65\x74\141\142\x6f\170"]); goto zP; zP: \add_filter("\x71\165\x65\x72\171\x5f\166\x61\x72\x73", [$this, "\141\x64\x64\x5f\161\165\145\162\171\137\146\x6f\162\x5f\x72\145\x70\157\x72\164"]); goto fx; L_: \add_filter("\x62\x75\154\x6b\137\141\143\164\x69\157\x6e\163\x2d\145\x64\151\164\55" . self::BL, [$this, "\162\x65\155\157\x76\145\x5f\x62\165\154\x6b\x5f\x61\x63\164\151\x6f\x6e\x73"], 999, 1); goto gI; C2: \add_action("\x69\x6e\x69\164", [$this, "\x69\x6e\x69\x74"]); goto jl; ui: } public function add_query_for_report($dt) { $dt[] = self::Cf; return $dt; } public function init() : void { goto uX; mD: $FQ = \Power_Shop_Base::get_register_info(); goto Ge; Rg: FQ: goto Sq; I9: jN: goto rt; Dh: $this->iel = true; goto Rg; r8: if (!AXD::gt($this->count_publish)) { goto FQ; } goto Dh; ra: \add_rewrite_rule("\136" . self::BL . "\x2f\50\x5b\x5e\x2f\135\x2b\51\x2f\x72\x65\160\x6f\x72\164\x2f\77\x24", "\151\156\144\145\x78\x2e\x70\150\160\x3f\160\x6f\x73\x74\x5f\x74\x79\x70\145\x3d" . self::BL . "\46\x6e\141\155\x65\75\44\155\141\164\x63\150\x65\163\133\x31\x5d\46" . self::Cf . "\x3d\x31", "\164\x6f\160"); goto J3; jk: return; goto I9; ph: $this->count_publish = $zF->publish; goto r8; rt: $zF = \wp_count_posts(self::BL); goto ph; uX: Functions::register_cpt(self::Gm); goto ra; Ge: if (!@$FQ->is_valid) { goto jN; } goto jk; J3: \flush_rewrite_rules(); goto mD; Sq: } public function add_post_meta() : void { foreach (self::zR as $u8) { \register_meta("\x70\157\x73\x74", $_ENV["\x53\x4e\101\x4b\x45"] . "\x5f" . $u8, ["\x74\171\x70\x65" => "\163\164\162\151\156\x67", "\163\150\x6f\167\137\x69\156\137\x72\145\x73\164" => true, "\163\x69\x6e\147\154\145" => true]); sw: } uG: } public function init_metabox() : void { \add_action("\x61\144\x64\x5f\155\x65\164\141\137\142\x6f\x78\145\x73", [$this, "\141\x64\x64\x5f\155\145\x74\141\x62\157\170\x73"]); \add_filter("\162\x65\x77\x72\x69\x74\145\x5f\162\165\154\x65\x73\137\x61\162\x72\141\171", [$this, "\143\165\163\x74\x6f\155\137\x70\157\x73\x74\x5f\x74\x79\160\145\137\162\x65\167\162\x69\164\145\x5f\x72\165\154\x65\163"]); } public function custom_post_type_rewrite_rules($V0) { goto pz; pz: global $KB; goto xc; gL: return $V0; goto e6; xc: $KB->flush_rules(); goto gL; e6: } public function add_metaboxs() : void { Functions::add_metabox(["\151\x64" => $_ENV["\126\111\x54\x45\137\x52\x45\116\104\x45\x52\x5f\111\x44\x5f\x31"], "\x6c\x61\x62\145\x6c" => __("\101\x64\x64\145\144\40\120\162\157\144\x75\143\x74\x73", $_ENV["\x4b\x45\102\101\x42"])]); Functions::add_metabox(["\x69\144" => $_ENV["\126\111\124\105\x5f\122\x45\116\x44\105\122\x5f\x49\x44\137\x32"], "\154\141\142\x65\154" => __("\123\x61\154\145\x73\40\x53\x74\141\x74\x73", $_ENV["\x4b\x45\x42\101\102"])]); } public function load_report_template($bF) { goto S_; La: if (!file_exists($MB)) { goto ZA; } goto ed; Kd: ZA: goto no; b9: if (!\get_query_var(self::Cf)) { goto AZ; } goto La; LG: return $bF; goto oy; ed: return $MB; goto Kd; S_: $MB = Bootstrap::get_plugin_dir() . "\151\156\x63\x2f\164\x65\155\160\154\x61\x74\145\163\x2f\162\x65\160\157\162\x74\x2e\160\150\x70"; goto b9; no: AZ: goto LG; oy: } public function set_default_power_shop_meta($vV, $ib, $av) { goto pu; NC: \add_post_meta($vV, $_ENV["\x53\x4e\101\113\x45"] . "\137\x6d\145\164\x61", "\x5b\135", true); goto vM; vM: aQ: goto k_; pu: $ib = \get_post($vV); goto cB; jn: $X8 = \wp_create_nonce($_ENV["\x4b\105\x42\x41\102"]); goto Hg; m4: \add_post_meta($vV, $_ENV["\123\x4e\x41\x4b\x45"] . "\x5f\162\145\160\157\162\164\x5f\160\141\163\163\167\x6f\162\x64", $nD, true); goto NC; cB: if (!(!$av && $ib->post_type === self::BL)) { goto aQ; } goto jn; Hg: $nD = base64_encode($X8); goto m4; k_: } public function post_published_limit($vV, $ib, $c0) { goto Hx; WW: US: goto TF; Vy: \wp_update_post($ib); goto WW; Hx: if (!$this->iel) { goto US; } goto xN; xN: $ib = array("\160\x6f\x73\164\x5f\163\164\x61\x74\165\163" => "\x64\162\141\x66\x74"); goto Vy; TF: } public function remove_row_actions($Ea, $ib) { goto vF; vF: if (!(self::BL === $ib->post_type)) { goto a9; } goto EL; t1: return $Ea; goto vm; EL: unset($Ea["\x69\x6e\x6c\151\x6e\x65\40\x68\151\x64\145\55\151\146\55\156\x6f\55\152\x73"]); goto nc; rg: a9: goto t1; nc: return $Ea; goto rg; vm: } public function remove_bulk_actions($Ea) { unset($Ea["\x65\x64\x69\164"]); return $Ea; } public function limit_admin_head() { goto TV; Gg: if (!($this->iel && !empty($Nu))) { goto EO; } goto YM; gt: $Nu = \get_posts(array("\x70\x6f\x73\164\x5f\164\171\160\145" => self::BL, "\x70\x6f\x73\x74\137\163\164\x61\164\165\163" => "\160\165\142\154\x69\163\x68", "\146\x69\x65\154\x64\x73" => "\x69\x64\163", "\160\157\163\x74\x73\x5f\x70\x65\x72\137\x70\141\147\x65" => -1)); goto Gg; J0: wk: goto t0; jY: if (!("\x65\144\x69\164\55" . self::BL !== $jZ->id)) { goto QC; } goto wW; wW: return; goto Mc; Mc: QC: goto gt; YM: foreach ($Nu as $Hi => $q9) { goto Kz; Kz: if (!($Hi !== 0)) { goto z9; } goto iU; iU: \wp_update_post(array("\x49\104" => $q9, "\x70\157\163\164\x5f\163\x74\141\x74\165\163" => "\x64\162\x61\146\x74")); goto It; It: z9: goto Y1; Y1: ku: goto cx; cx: } goto J0; t0: EO: goto NN; TV: $jZ = \get_current_screen(); goto jY; NN: } public function limit_css_and_js() { goto TS; TS: if (!AXD::gte($this->count_publish)) { goto R0; } goto cE; c9: wp_localize_script(self::BL, "\160\157\x77\145\x72\123\x68\157\160\104\141\164\141", ["\142\165\x79\114\151\156\x6b" => $_ENV["\x42\125\x59\137\x4c\x49\103\105\116\123\x45\x5f\x4c\111\x4e\113"], "\x6c\151\x63\x65\x6e\x73\x65\114\151\156\x6b" => \admin_url(self::rt), "\x73\165\x70\x70\x6f\x72\164\105\155\x61\151\x6c" => $_ENV["\123\125\x50\x50\117\122\124\x5f\105\x4d\x41\x49\114"]]); goto Ba; AN: \wp_enqueue_style("\152\161\165\145\x72\x79\x2d\x63\x6f\x6e\146\x69\x72\x6d", Bootstrap::get_plugin_url() . "\151\x6e\x63\57\x61\x73\163\x65\164\x73\57\x70\141\x63\153\x61\147\145\163\x2f\x6a\161\x75\x65\x72\171\55\143\x6f\156\x66\x69\162\155\57\x6a\161\165\145\x72\x79\x2d\143\x6f\x6e\146\151\162\x6d\56\x6d\151\156\x2e\x63\163\163"); goto Al; Ba: R0: goto gz; cE: \wp_enqueue_style(self::BL, Bootstrap::get_plugin_url() . "\151\156\x63\57\141\x73\x73\x65\164\x73\x2f\143\x73\163\x2f\x6d\141\x69\x6e\x2e\x63\163\163"); goto AN; Al: \wp_enqueue_script("\152\x71\165\145\x72\171\55\x63\x6f\x6e\x66\151\x72\155", Bootstrap::get_plugin_url() . "\151\x6e\143\57\141\163\x73\145\164\x73\57\160\x61\x63\x6b\x61\147\x65\x73\x2f\x6a\x71\165\145\x72\x79\55\x63\157\156\x66\x69\162\155\x2f\152\x71\x75\x65\x72\x79\55\x63\x6f\x6e\x66\151\162\155\x2e\155\x69\156\x2e\x6a\163", array("\152\x71\x75\x65\x72\171"), "\x33\x2e\x33\x2e\64", true); goto GU; GU: \wp_enqueue_script(self::BL, Bootstrap::get_plugin_url() . "\151\x6e\143\57\x61\x73\x73\x65\164\163\57\x6a\163\57\155\x61\151\x6e\x2e\152\x73", array("\x6a\161\165\x65\162\171\55\143\x6f\x6e\x66\x69\162\155"), Bootstrap::get_plugin_ver(), true); goto c9; gz: } public function limit_admin_notices() { goto IQ; Zl: $y8 = "\11\11\74\x64\x69\166\x20\x69\x64\x3d\47\160\x6f\x77\x65\x72\55\163\150\x6f\x70\55\162\145\x6d\151\x6e\144\x65\x72\47\x20\x63\154\141\x73\x73\75\42\x6e\157\164\151\x63\x65\x20\156\x6f\x74\151\x63\x65\55\x69\156\x66\x6f\x20\x69\x73\x2d\x64\x69\x73\155\x69\163\x73\x69\x62\154\x65\42\x20\x73\x74\171\x6c\145\75\42\x62\x6f\162\144\x65\162\x2d\154\x65\x66\x74\55\x63\x6f\x6c\157\x72\x3a{$pp}\x3b\x22\76\xd\xa\11\x9\11\74\144\151\166\40\143\x6c\x61\x73\163\x3d\x22\x65\55\x6e\157\x74\x69\143\x65\x5f\137\143\157\156\x74\x65\156\164\x22\x3e\15\xa\11\11\11\11\74\150\63\76\345\x8d\207\347\264\x9a\x50\157\167\x65\162\x53\x68\157\x70\xef\274\x8c\350\256\x93\344\xbd\240\347\232\x84\345\x95\206\xe5\xba\x97\346\233\264\xe6\x9c\211\x50\117\127\x45\x52\41\x3c\x2f\x68\63\76\15\xa\15\12\11\11\x9\x9\74\160\76\346\202\xa8\xe7\217\xbe\345\x9c\xa8\xe4\xbd\277\347\224\250\xe7\x9a\204\346\x98\257\345\x85\x8d\350\262\xbb\xe7\211\210\347\x9a\204\x50\x6f\x77\145\x72\x53\150\157\160\345\244\x96\346\x8e\233\xef\xbc\x8c\xe5\203\x85\350\x83\275\347\231\274\344\275\210\xe4\xb8\200\345\200\213\xe5\x95\x86\xe5\272\227\xe3\x80\202\345\215\207\xe7\xb4\232\xe4\xbb\x98\350\262\273\xe7\211\210\357\xbc\214\xe5\215\xb3\345\217\257\350\xa7\xa3\xe9\216\x96\345\xae\x8c\346\225\264\xe5\212\237\350\203\275\x3c\x2f\160\x3e\15\xa\xd\xa\11\11\x9\11\x3c\160\x3e\346\x9c\211\344\273\xbb\344\275\x95\xe5\256\xa2\346\234\215\345\225\x8f\351\241\214\357\xbc\214\350\253\x8b\347\xa7\x81\xe8\xa8\212\xe7\253\x99\xe9\225\xb7\xe8\267\xaf\xe5\217\xaf\xe7\xb6\262\xe7\xab\231\xe5\x8f\xb3\344\xb8\x8b\xe6\x96\xb9\xe5\xb0\215\xe8\xa9\261\xe6\xa1\206\357\xbc\214\346\x88\x96\346\x98\xaf\xe4\xbe\x86\xe4\xbf\241\x20\x3c\x61\40\164\141\162\147\x65\x74\75\x22\x5f\x62\154\141\156\153\42\x20\x68\162\145\x66\x3d\x22\155\x61\x69\x6c\164\x6f\x3a{$rn}\42\76{$rn}\x3c\57\141\76\15\12\xd\12\x9\11\x9\11\x3c\144\x69\x76\40\x73\x74\x79\154\x65\75\x22\x64\151\163\x70\154\141\x79\72\x20\x66\x6c\145\x78\73\x6d\141\162\147\151\x6e\x2d\142\x6f\164\x74\157\155\72\x31\162\145\x6d\73\42\76\15\xa\x9\11\11\x9\x9\74\141\40\150\162\x65\x66\x3d\42{$RN}\42\40\164\x61\x72\x67\x65\x74\75\42\x5f\x62\154\x61\x6e\x6b\42\40\x63\x6c\x61\163\163\75\42\x62\165\164\164\x6f\x6e\x20\x62\165\164\x74\157\x6e\55\160\162\x69\x6d\141\x72\171\x20\x62\165\164\164\157\156\55\154\x61\162\x67\145\x22\40\163\x74\171\154\145\x3d\42\155\141\x72\x67\x69\156\x2d\162\x69\x67\x68\164\72\x20\60\56\65\x72\145\x6d\x3b\x62\141\143\153\147\x72\x6f\165\x6e\x64\x2d\143\x6f\154\x6f\162\x3a\x20{$pp}\73\142\x6f\x72\144\x65\162\55\143\157\x6c\157\162\x3a{$pp}\x3b\42\76\350\xb3\274\xe8\262\xb7\xe6\216\210\xe6\xac\x8a\74\57\x61\x3e\15\xa\11\x9\x9\x9\x9\x3c\141\40\150\162\x65\x66\x3d\x22{$zb}\x22\x20\143\x6c\141\x73\163\x3d\42\x62\x75\x74\x74\x6f\x6e\x20\142\x75\x74\164\157\x6e\55\x6c\x61\162\x67\145\42\40\x73\x74\171\x6c\145\x3d\x22\x62\157\162\x64\145\x72\x2d\143\157\x6c\x6f\x72\x3a{$pp}\x3b\x63\x6f\x6c\157\162\72{$pp}\x3b\x22\x3e\350\274\270\345\x85\xa5\346\x8e\x88\xe6\xac\212\xe7\242\xbc\74\57\x61\76\xd\xa\11\x9\x9\11\x3c\x2f\x64\x69\166\76\xd\12\x9\11\x9\x9\x3c\141\x20\x68\162\145\x66\75\x22\43\42\40\x69\144\75\42\x68\151\144\x65\55\x72\145\155\151\x6e\x64\x65\162\x22\x3e\xe4\xb8\x8d\xe8\246\x81\345\206\x8d\351\241\257\347\xa4\xba\x3c\x2f\141\76\xd\12\11\x9\11\x3c\57\144\x69\166\x3e\15\xa\11\11\74\57\x64\151\166\76"; goto f4; I6: $rn = $_ENV["\x53\x55\x50\x50\x4f\122\x54\x5f\x45\115\101\111\114"]; goto w4; NL: $RN = $_ENV["\102\125\131\137\x4c\x49\x43\105\x4e\x53\105\137\x4c\x49\x4e\x4b"]; goto Su; Ne: if (!("\145\x64\151\x74\x2d" . self::BL !== $jZ->id)) { goto Q_; } goto fv; vh: Xa: goto NL; rn: if (!@$FQ->is_valid) { goto Xa; } goto Vp; Vp: return; goto vh; w4: $pp = self::tJ; goto Zl; Su: $zb = \admin_url(self::rt); goto I6; f4: echo $y8; goto be; IQ: $jZ = \get_current_screen(); goto Ne; fv: return; goto x5; x5: Q_: goto wZ; wZ: $FQ = \Power_Shop_Base::get_register_info(); goto rn; be: } } new CPT();