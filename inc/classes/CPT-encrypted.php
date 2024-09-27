<?php
declare (strict_types=1);
namespace J7\PowerShop;

final class CPT extends Bootstrap {
	const X0               = "\160\x73\x5f\x72\145\160\157\162\x74";
	const fd               = [ "\x6d\x65\164\141", "\163\x65\164\164\x69\156\x67\163" ];
	const K2               = "\x50\x6f\167\145\162\40\123\150\157\160";
	const pM               = "\x70\x6f\x77\145\162\55\x73\x68\x6f\x70";
	const Zc               = "\145\144\151\164\x2e\x70\150\x70\x3f\160\x6f\163\164\x5f\x74\171\160\145\75\x70\x6f\167\x65\162\x2d\163\150\x6f\160\x26\x70\141\147\x65\x3d\x70\x6f\x77\145\162\x2d\163\150\157\x70\x2d\154\151\143\x65\156\x73\x65";
	const UY               = "\x23\67\62\141\x65\x65\x36";
	const FA               = Plugin::$snake;
	const fw               = Plugin::$kebab;
	const s7               = Bootstrap::RENDER_ID_1;
	const sn               = Bootstrap::RENDER_ID_2;
	const ff               = Bootstrap::BUY_LICENSE_LINK;
	const KM               = Bootstrap::SUPPORT_EMAIL;
	private $count_publish = 0;
	private $iel           = false;
	public function __construct() {
		goto NR;
		NR: \add_action("\x69\156\x69\x74", [ $this, "\151\x6e\x69\164" ]);
		goto So;
		Tx: \add_action("\x61\144\155\x69\x6e\137\156\157\164\151\143\x65\x73", [ $this, "\154\x69\x6d\151\164\x5f\141\x64\x6d\x69\156\x5f\x6e\x6f\x74\151\143\x65\x73" ], 999);
		goto AC;
		QD: \add_filter("\164\145\x6d\x70\x6c\x61\x74\145\x5f\151\x6e\x63\x6c\x75\144\x65", [ $this, "\154\157\141\144\x5f\162\x65\x70\x6f\162\x74\137\164\x65\155\160\x6c\x61\x74\x65" ], 999);
		goto SZ;
		eV: \add_action("\160\x75\142\154\x69\163\150\x5f" . self::pM, [ $this, "\x70\157\163\164\x5f\160\165\142\154\x69\x73\150\145\x64\137\x6c\x69\155\x69\x74" ], 999, 3);
		goto tg;
		SZ: \add_action("\167\160\137\151\x6e\163\145\162\x74\137\x70\157\x73\164", [ $this, "\163\x65\164\x5f\144\145\x66\141\165\154\x74\137\x70\x6f\x77\x65\x72\137\x73\150\157\160\137\155\145\164\141" ], 10, 3);
		goto eV;
		So: \add_action("\162\145\163\164\137\x61\x70\x69\x5f\151\156\151\164", [ $this, "\141\144\x64\137\160\x6f\x73\164\137\155\145\164\141" ]);
		goto kf;
		LY: \add_action("\x6c\x6f\141\144\55\x70\157\163\164\55\156\x65\167\x2e\x70\x68\x70", [ $this, "\x69\x6e\151\x74\137\155\x65\x74\141\142\157\x78" ]);
		goto nm;
		tg: \add_filter("\x70\x6f\x73\x74\x5f\162\157\167\137\141\x63\x74\151\157\156\x73", [ $this, "\162\x65\x6d\157\x76\x65\137\162\x6f\167\x5f\141\143\x74\151\157\156\163" ], 999, 2);
		goto uM;
		nm: \add_filter("\x71\165\x65\162\x79\x5f\x76\141\162\x73", [ $this, "\x61\x64\x64\x5f\x71\165\x65\162\171\137\146\157\162\137\162\x65\160\157\x72\164" ]);
		goto QD;
		kf: \add_action("\x6c\x6f\x61\144\55\160\x6f\x73\x74\x2e\160\x68\x70", [ $this, "\151\156\151\x74\x5f\x6d\x65\164\x61\x62\157\x78" ]);
		goto LY;
		Fc: \add_action("\x61\144\x6d\x69\156\137\145\x6e\161\x75\x65\165\145\137\163\143\162\151\x70\164\x73", [ $this, "\x6c\151\155\x69\164\137\x63\163\x73\137\x61\156\144\x5f\152\x73" ], 999);
		goto eL;
		uM: \add_filter("\x62\165\x6c\x6b\137\141\x63\x74\x69\157\x6e\163\x2d\x65\x64\x69\164\55" . self::pM, [ $this, "\162\x65\155\x6f\x76\145\x5f\x62\165\x6c\x6b\x5f\x61\x63\164\151\x6f\x6e\163" ], 999, 1);
		goto Fc;
		eL: \add_action("\x61\144\155\x69\156\x5f\150\x65\141\144", [ $this, "\x6c\151\x6d\x69\x74\137\x61\x64\155\x69\156\x5f\150\x65\141\x64" ], 999, 1);
		goto Tx;
		AC: } public function add_query_for_report( $yp ) {
		$yp[] = self::X0;
		return $yp;
		} public function init(): void {
			goto so;
			aU: SJ: goto JM;
			z5: if (!@$I8?->is_valid) {
				goto SJ;
			} goto yG;
			Po: $I8 = \Power_Shop_Base::get_register_info();
			goto z5;
			rP: if (!AXD::gt($this->count_publish)) {
				goto KM;
			} goto vX;
			UY: \flush_rewrite_rules();
			goto Po;
			pQ: $this->count_publish = $A0->publish;
			goto rP;
			yG: return;
			goto aU;
			so: Functions::register_cpt(self::K2);
			goto GD;
			GD: \add_rewrite_rule("\136" . self::pM . "\57\x28\133\x5e\x2f\x5d\x2b\x29\x2f\162\145\x70\157\162\x74\57\x3f\x24", "\151\156\144\x65\170\x2e\160\x68\x70\77\x70\x6f\163\164\137\164\x79\160\145\x3d" . self::pM . "\x26\x6e\141\x6d\145\x3d\44\155\141\x74\x63\150\x65\163\x5b\x31\135\x26" . self::X0 . "\x3d\61", "\164\157\160");
			goto UY;
			vX: $this->iel = true;
			goto Jp;
			JM: $A0 = \wp_count_posts(self::pM);
			goto pQ;
			Jp: KM: goto o7;
			o7: } public function add_post_meta(): void {
			foreach (self::fd as $G8) {
				\register_meta(
				"\160\x6f\163\164",
				self::FA . "\x5f" . $G8,
				[
					"\x74\171\x70\x65"         => "\x73\x74\x72\151\x6e\147",
					"\x73\150\157\x77\137\x69\156\x5f\x72\145\x73\x74" => true,
					"\163\151\x6e\x67\x6c\145" => true,
				]
				);
				Yi: } s0: } public function init_metabox(): void {
				\add_action("\x61\x64\144\x5f\x6d\145\164\x61\x5f\x62\x6f\x78\145\163", [ $this, "\141\x64\x64\x5f\x6d\x65\164\141\142\x6f\x78\x73" ]);
				\add_filter("\162\x65\167\x72\151\164\145\x5f\x72\165\154\145\x73\x5f\141\x72\x72\x61\x79", [ $this, "\x63\x75\163\x74\x6f\x6d\137\160\x6f\163\x74\137\164\171\160\x65\x5f\x72\x65\167\162\151\164\x65\x5f\162\165\154\x65\x73" ]);
				} public function custom_post_type_rewrite_rules( $K6 ) {
					goto Mo;
					jo: if (!( is_object($Bz) && !is_null($Bz) )) {
						goto LB;
					} goto nY;
					h8: return $K6;
					goto Lg;
					nY: $Bz->flush_rules();
					goto Dz;
					Mo: global $Bz;
					goto jo;
					Dz: LB: goto h8;
					Lg: } public function add_metaboxs(): void {
					Functions::add_metabox(
					[
						"\151\144"             => self::s7,
						"\x6c\141\142\145\x6c" => __("\101\144\x64\x65\x64\40\x50\x72\x6f\x64\165\x63\x74\x73", self::fw),
					]
					);
					Functions::add_metabox(
					[
						"\x69\x64"             => self::sn,
						"\154\x61\142\x65\x6c" => __("\123\141\154\145\163\40\123\x74\141\164\163", self::fw),
					]
					);
					} public function load_report_template( $d6 ) {
						goto xo;
						SO: Xp: goto Ci;
						vn: return $d6;
						goto Vv;
						xo: $bN = Plugin::$dir . "\x2f\151\156\143\57\164\145\155\160\154\141\x74\145\x73\57\x72\145\x70\157\162\164\56\160\150\160";
						goto tx;
						Ci: FT: goto vn;
						RF: if (!file_exists($bN)) {
							goto Xp;
						} goto oi;
						tx: if (!\get_query_var(self::X0)) {
							goto FT;
						} goto RF;
						oi: return $bN;
						goto SO;
						Vv: } public function set_default_power_shop_meta( $DL, $J6, $my ) {
						goto Km;
						Fr: if (!( !$my && $J6->post_type === self::pM )) {
							goto nB;
						} goto HL;
						zq: nB: goto KS;
						HG: $uB = base64_encode($vK);
						goto bo;
						bo: \add_post_meta($DL, self::FA . "\x5f\x72\145\160\157\x72\x74\137\x70\x61\x73\x73\x77\x6f\x72\144", $uB, true);
						goto Y7;
						Km: $J6 = \get_post($DL);
						goto Fr;
						Y7: \add_post_meta($DL, self::FA . "\x5f\x6d\145\x74\x61", "\133\135", true);
						goto zq;
						HL: $vK = \wp_create_nonce(self::fw);
						goto HG;
						KS: } public function post_published_limit( $DL, $J6, $Zn ) {
							goto id;
							me: tC: goto kr;
							H_: \wp_update_post($J6);
							goto me;
							id: if (!$this->iel) {
								goto tC;
							} goto CB;
							CB: $J6 = [ "\x70\157\x73\164\137\163\x74\141\x74\x75\x73" => "\144\x72\x61\146\x74" ];
							goto H_;
							kr: } public function remove_row_actions( $Y3, $J6 ) {
							goto zO;
							zO: if (!( self::pM === $J6->post_type )) {
								goto Dt;
							} goto gI;
							ym: Dt: goto qb;
							gI: unset($Y3["\x69\x6e\154\151\156\x65\x20\150\151\x64\145\55\151\x66\x2d\156\x6f\x2d\x6a\x73"]);
							goto pu;
							pu: return $Y3;
							goto ym;
							qb: return $Y3;
							goto bu;
							bu: } public function remove_bulk_actions( $Y3 ) {
								unset($Y3["\x65\x64\151\164"]);
								return $Y3;
							} public function limit_admin_head() {
								goto gY;
								uh: br: goto HX;
								gY: $p_ = \get_current_screen();
								goto jC;
								CO: X9: goto hT;
								Ri: zz: goto uh;
								jC: if (!( "\145\x64\151\164\x2d" . self::pM !== $p_->id )) {
									goto X9;
								} goto Ha;
								Vz: foreach ($Ce as $GE => $Dl) {
									goto K9;
									oq: zv: goto fw;
									No: \wp_update_post(
									[
										"\111\104" => $Dl,
										"\160\x6f\x73\164\137\x73\x74\141\164\x75\x73" => "\x64\162\141\x66\x74",
									]
									);
									goto oq;
									K9: if (!( $GE !== 0 )) {
										goto zv;
									} goto No;
									fw: Qw: goto d1;
									d1: } goto Ri;
								jH: if (!( $this->iel && !empty($Ce) )) {
									goto br;
								} goto Vz;
								Ha: return;
								goto CO;
								hT: $Ce = \get_posts(
								[
									"\160\157\163\x74\x5f\164\171\x70\x65" => self::pM,
									"\x70\157\x73\x74\137\163\164\141\x74\x75\x73" => "\x70\x75\x62\154\x69\163\x68",
									"\146\151\145\x6c\144\163" => "\151\x64\x73",
									"\160\157\163\x74\x73\137\x70\145\x72\137\x70\x61\147\x65" => -1,
								]
								);
								goto jH;
								HX: } public function limit_css_and_js() {
								goto YA;
								sM: \wp_enqueue_script("\152\x71\165\x65\x72\171\x2d\x63\157\x6e\x66\x69\x72\155", Plugin::$url . "\x2f\151\156\x63\x2f\141\163\x73\145\x74\x73\57\160\141\143\153\141\147\x65\163\57\x6a\161\x75\x65\x72\171\55\143\x6f\x6e\x66\151\162\155\x2f\152\161\x75\145\x72\x79\x2d\143\x6f\x6e\146\151\x72\155\56\x6d\151\156\x2e\152\x73", [ "\x6a\161\x75\145\x72\171" ], "\x33\56\x33\56\64", true);
								goto Hz;
								SS: eQ: goto bd;
								YA: if (!AXD::gte($this->count_publish)) {
									goto eQ;
								} goto Ga;
								sc: \wp_enqueue_style("\x6a\161\165\145\x72\171\55\143\x6f\156\x66\x69\162\x6d", Plugin::$url . "\x2f\151\x6e\x63\x2f\141\x73\x73\x65\164\163\57\160\141\x63\x6b\141\x67\145\163\57\152\161\x75\x65\x72\x79\x2d\x63\157\x6e\x66\151\x72\x6d\x2f\152\x71\165\x65\x72\x79\x2d\x63\x6f\156\x66\151\162\x6d\x2e\155\x69\156\x2e\x63\163\x73");
								goto sM;
								Hz: \wp_enqueue_script(self::pM, Plugin::$url . "\x2f\x69\156\x63\x2f\x61\163\163\145\164\163\57\x6a\163\x2f\155\x61\x69\156\56\x6a\163", [ "\152\161\165\x65\162\x79\x2d\143\x6f\156\x66\151\162\155" ], Plugin::$version, true);
								goto eE;
								Ga: \wp_enqueue_style(self::pM, Plugin::$url . "\57\151\x6e\x63\x2f\141\163\x73\x65\x74\163\x2f\x63\x73\163\x2f\155\141\151\156\56\143\x73\x73");
								goto sc;
								eE: wp_localize_script(
								self::pM,
								"\x70\x6f\x77\145\x72\123\150\157\160\104\141\x74\141",
								[
									"\142\x75\x79\114\151\x6e\153" => self::ff,
									"\x6c\x69\143\145\156\x73\145\x4c\x69\156\153" => \admin_url(self::Zc),
									"\163\x75\x70\x70\157\162\164\x45\155\x61\151\x6c" => self::KM,
								]
								);
								goto SS;
								bd: } public function limit_admin_notices() {
									goto TX;
									TX: $p_ = \get_current_screen();
									goto DV;
									NZ: $I8 = \Power_Shop_Base::get_register_info();
									goto E6;
									Di: echo $hj;
									goto lo;
									E6: if (!@$I8?->is_valid) {
										goto Sa;
									} goto su;
									fy: $Fo = self::KM;
									goto V_;
									rF: $em = \admin_url(self::Zc);
									goto fy;
									DV: if (!( "\x65\144\x69\164\55" . self::pM !== $p_->id )) {
										goto Ps;
									} goto Ln;
									OQ: $Lg = self::ff;
									goto rF;
									su: return;
									goto eF;
									ZH: Ps: goto NZ;
									z7: $hj = "\11\11\74\x64\151\x76\x20\x69\x64\75\x27\160\157\167\145\162\55\163\150\157\x70\x2d\162\145\x6d\x69\156\144\145\162\x27\40\x63\x6c\x61\x73\x73\75\42\156\x6f\164\151\143\145\x20\156\157\x74\x69\x63\145\x2d\151\x6e\146\157\x20\x69\163\x2d\x64\151\x73\x6d\151\x73\163\x69\142\154\145\42\x20\163\x74\x79\x6c\x65\75\x22\x62\157\162\x64\145\162\x2d\154\145\146\x74\55\143\x6f\154\x6f\162\x3a{$JY}\x3b\x22\x3e\xd\12\x9\11\x9\74\144\151\166\x20\143\x6c\x61\x73\163\75\42\145\55\x6e\157\164\x69\143\145\137\137\143\x6f\156\x74\145\x6e\164\x22\x3e\15\xa\11\x9\11\x9\74\150\63\76\345\215\207\xe7\xb4\x9a\120\x6f\x77\145\x72\x53\x68\x6f\160\xef\xbc\214\xe8\xae\223\xe4\275\xa0\xe7\x9a\x84\xe5\225\206\345\xba\x97\xe6\x9b\xb4\346\234\x89\120\117\127\105\x52\x21\x3c\x2f\x68\63\x3e\xd\12\xd\12\x9\x9\11\x9\74\x70\x3e\xe6\x82\xa8\xe7\x8f\276\xe5\234\xa8\344\275\277\xe7\x94\250\xe7\232\x84\xe6\230\xaf\345\205\x8d\xe8\262\273\347\211\x88\xe7\232\x84\120\x6f\167\x65\x72\123\x68\x6f\x70\345\xa4\x96\346\x8e\233\357\274\x8c\xe5\x83\205\350\x83\275\347\x99\xbc\344\xbd\210\344\270\x80\xe5\200\x8b\xe5\225\x86\xe5\xba\x97\xe3\x80\202\xe5\x8d\207\xe7\264\x9a\344\xbb\230\xe8\262\273\xe7\211\x88\357\274\x8c\345\215\263\345\217\257\xe8\247\xa3\351\216\226\xe5\xae\x8c\xe6\x95\xb4\345\x8a\237\xe8\x83\xbd\x3c\57\x70\76\xd\xa\15\12\x9\x9\11\11\x3c\160\x3e\xe6\x9c\211\xe4\273\xbb\344\xbd\x95\345\256\242\346\234\215\xe5\x95\x8f\xe9\241\x8c\357\xbc\x8c\350\253\213\347\xa7\x81\350\250\212\xe7\253\x99\351\225\xb7\350\xb7\257\xe5\x8f\257\xe7\266\262\347\253\x99\xe5\217\263\xe4\270\213\xe6\226\271\345\xb0\x8d\xe8\251\xb1\xe6\xa1\206\357\274\214\346\x88\x96\346\x98\xaf\344\276\x86\344\xbf\241\x20\x3c\141\40\164\141\162\x67\145\x74\x3d\42\137\x62\154\x61\156\153\42\40\x68\162\x65\x66\75\x22\155\141\x69\x6c\164\157\72{$Fo}\x22\x3e{$Fo}\x3c\x2f\141\x3e\xd\xa\15\xa\11\x9\11\11\x3c\x64\151\166\x20\163\x74\x79\x6c\145\x3d\x22\x64\151\163\x70\x6c\141\x79\72\x20\x66\x6c\x65\x78\73\x6d\141\x72\147\151\x6e\55\142\157\x74\x74\157\155\72\x31\x72\145\x6d\x3b\x22\76\xd\xa\11\x9\x9\11\x9\74\x61\40\150\x72\x65\x66\75\42{$Lg}\x22\x20\x74\141\x72\147\145\164\x3d\42\x5f\x62\x6c\141\x6e\153\x22\x20\143\x6c\141\x73\163\75\x22\x62\x75\164\164\x6f\x6e\40\x62\x75\164\164\x6f\156\x2d\x70\x72\151\x6d\x61\162\x79\40\142\165\x74\x74\x6f\156\55\x6c\141\162\x67\145\42\40\163\x74\x79\x6c\x65\75\x22\x6d\x61\162\147\x69\x6e\55\162\151\x67\150\164\x3a\40\x30\56\x35\162\x65\x6d\73\x62\x61\143\x6b\x67\x72\157\x75\156\144\x2d\x63\x6f\154\x6f\x72\72\x20{$JY}\73\142\x6f\x72\x64\x65\162\x2d\x63\157\x6c\x6f\162\x3a{$JY}\73\42\76\xe8\xb3\274\350\262\267\346\x8e\210\xe6\xac\x8a\x3c\x2f\x61\76\15\12\x9\x9\11\x9\11\74\141\40\150\162\x65\146\75\42{$em}\42\x20\143\x6c\x61\x73\163\75\42\142\165\164\164\x6f\x6e\x20\142\x75\x74\164\157\156\x2d\x6c\x61\162\147\145\x22\x20\163\x74\171\154\145\75\42\142\157\162\144\x65\162\x2d\x63\157\154\x6f\x72\72{$JY}\73\143\x6f\154\x6f\x72\72{$JY}\x3b\x22\76\xe8\274\xb8\345\205\xa5\xe6\x8e\210\346\254\x8a\xe7\xa2\xbc\x3c\57\141\x3e\15\12\x9\x9\x9\x9\74\x2f\144\151\x76\x3e\15\12\11\11\x9\x9\x3c\x61\40\150\162\x65\x66\x3d\42\43\42\40\x69\x64\x3d\42\150\151\x64\145\x2d\x72\x65\x6d\151\x6e\x64\x65\162\x22\76\xe4\270\215\xe8\246\x81\xe5\x86\215\351\241\xaf\347\xa4\272\x3c\x2f\141\x3e\15\12\11\x9\x9\74\57\144\x69\x76\x3e\xd\12\x9\11\x3c\57\144\151\166\x3e";
									goto Di;
									Ln: return;
									goto ZH;
									eF: Sa: goto OQ;
									V_: $JY = self::UY;
									goto z7;
									lo: }
} new CPT();
