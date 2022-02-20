/*!
 * Google Analytics Tracking Code
 *
 * $HeadURL: https://stella.mycom.co.jp/svn/cnavi/branches/1801_renewal/linux/member/include/js/ga.js $
 * $Id: ga.js 36476 2017-07-10 09:54:25Z nagao.taiki $
 *
 * ref #4185 #4316 #5933 #6619
 */

var _gaAccount;
var _uaAccount;
switch(location.hostname.toLowerCase()) {
	case 'tenshoku.mynavi.jp' :
		_gaAccount = 'UA-23072088-1';
		_uaAccount = 'UA-23072088-2';
		break;
	case 'cnmnt.mycom.co.jp' :
		_gaAccount = 'UA-22650361-1';
		_uaAccount = 'UA-22650361-3';
		break;
	case 'cnpre.mycom.co.jp' :
		_gaAccount = 'UA-22650361-2';
		_uaAccount = 'UA-22650361-4';
		break;
	case 'cntry.mycom.co.jp' :
		_gaAccount = '';
		_uaAccount = 'UA-22650361-5';
		break;
	default :
		_gaAccount = '';
		_uaAccount = '';
}

// for Universal Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// Universal Analytics�֘A�̏�������
(function (w,d,uid,r,exp,cid) {
	if (_uaAccount) {
		ga('create', _uaAccount);
		ga(function(tracker) {
			cid = tracker.get('clientId');
			ga('set', 'dimension12', cid);
		});
		if ('_uaMid' in w) {
			if (_uaMid.match(/^m(\d+)$/)) {
				uid = _uaMid.replace(/^m(\d+)$/, 't$1');
				ga('set', '&uid', uid);
				ga('set', 'dimension4', uid);
				ga('set', 'dimension11', uid);
				exp = new Date();
				exp.setDate(exp.getDate()+366);
				d.cookie = '_mtid='+uid+'; expires='+exp.toGMTString()+'; path=/';
			}
		}
		if (!uid && (r=d.cookie.match(/_mtid=(t\d+)/))) {
			ga('set', 'dimension11', r[1]);
		}
	}
})(window,document);

var _gaq = _gaq || [];
var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
_gaq.push(['_require', 'inpage_linkid', pluginUrl]);
_gaq.push(['_setAccount', _gaAccount]);
_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_addOrganic', 'images.google','q']);
_gaq.push(['_addOrganic', 'azby.search.nifty','q',true]);
_gaq.push(['_addOrganic', 'nifty','q',true]);
_gaq.push(['_addOrganic', 'livedoor-search','q',true]);
_gaq.push(['_addOrganic', 'naver.jp','q',true]);
_gaq.push(['_addOrganic', 'so-net','query']);
_gaq.push(['_addOrganic', 'fresheye','kw']);
_gaq.push(['_addOrganic', 'auone','q',true]);
_gaq.push(['_addOrganic', 'hi-ho', 'search']);
_gaq.push(['_addOrganic', 'odn','search']);
_gaq.push(['_addOrganic', 'eonet','search']);
_gaq.push(['_addOrganic', 'toppa','search']);
_gaq.push(['_addOrganic', 'search.smt.docomo', 'MT',true]);
_gaq.push(['_addOrganic', 'excite','search']);
_gaq.push(['_addOrganic', 'asahi','Keywords']);
_gaq.push(['_addOrganic', 's.luna.tv', 'q']);
_gaq.push(['_addOrganic', 'lunascape', 'p']);
_gaq.push(['_addOrganic', 'hatena', 'word']);
_gaq.push(['_addOrganic', 'ecnavi', 'Keywords']);
_gaq.push(['_addOrganic', 'cybozu', 'Keywords']);
_gaq.push(['_addOrganic', 'cocacola', 'Keywords']);
_gaq.push(['_addOrganic', 'picmy.jp', 'Keywords']);
_gaq.push(['_addOrganic', 'adingo.jp', 'Keywords']);
_gaq.push(['_addOrganic', 'adingosearch', 'Keywords']);
_gaq.push(['_addOrganic', 'pex.jp', 'Keywords']);
_gaq.push(['_addOrganic', 'went.jp', 'Keywords']);
_gaq.push(['_addOrganic', 'unisearch.jp', 'keyword']);
_gaq.push(['_addOrganic', 'tnc.jword.jp', 'q']);
_gaq.push(['_addOrganic', 't-com.jword.jp', 'q']);
_gaq.push(['_addOrganic', 'search.jword.jp', 'name']);

function trimauthcode(u) {
	var re = /([^0-9a-zA-Z])([0-9][0-9][0-9a-zA-Z]{14})([^0-9a-zA-Z]|$)/g;
	u = u.replace(re, '$1_____$3');

	// cannot use $+ at Opera
	re = /([^0-9a-zA-Z])(y|z|code|Digesting|enc_param)=(([0-9a-zA-Z]|%2B|%3D|%2F){17,})&/g;
	u = u.replace(re, '$1$2=_____&');

	re = /([^0-9a-zA-Z])(y|z|code|Digesting|enc_param)=(([0-9a-zA-Z]|%2B|%3D|%2F){17,})$/g;
	u = u.replace(re, '$1$2=_____');

	return u;
}

var _getparams = location.search;
var _logginguri = ('_ua_logginguri' in window && _ua_logginguri) ? _ua_logginguri : trimauthcode(location.pathname + _getparams);
var _var4 = new Array();

// add member status to CustomVar
if ('_uaMid' in window) {
	if (_uaMid) {
		_var4.push('lnm');
		if ( ! location.pathname.match(/^\/(client|manage)\//) ){
			_var4.push('mem');
			_gaq.push(['_setCustomVar',		// �y�[�W
				3,							// This custom var is set to slot #1.  Required parameter.
				'page for member',			// The name of the custom variable.  Required parameter.
				't',						// The value of the custom variable.  Required parameter.
											//  (possible values might be Free, Bronze, Gold, and Platinum)
				3							// Sets the scope to visitor-level.  Optional parameter.
			]);
		}

		ga('set', 'dimension2', 't');
		_gaq.push(['_setCustomVar',			// �Z�b�V����
			2,								// This custom var is set to slot #1.  Required parameter.
			'session with member login',	// The name of the custom variable.  Required parameter.
			't',							// The value of the custom variable.  Required parameter.
											//  (possible values might be Free, Bronze, Gold, and Platinum)
			2								// Sets the scope to visitor-level.  Optional parameter.
		]);

		ga('set', 'dimension3', 't');
		_gaq.push(['_setCustomVar',			// ���[�U�[
			1,								// This custom var is set to slot #1.  Required parameter.
			'user is member',				// The name of the custom variable.  Required parameter.
			't',							// The value of the custom variable.  Required parameter.
											//  (possible values might be Free, Bronze, Gold, and Platinum)
			1								// Sets the scope to visitor-level.  Optional parameter.
		]);
	}
}

// set CustomVar4 'page status'
//		tag��������I�ɕ�܊֌W�ɂȂ�Ȃ��悤����
//	ssl		https
//	sp		�X�}�[�g�t�H����(�o���������Ă��Ȃ��y�[�W�� PC�ł����Ă���ꍇ���܂�)
//	mem		������O�C����(�R�[�h�͏㕔��)
//	lnm		������O�C����(�R�[�h�͏㕔��; /client �� /manage �ւ̃A�N�Z�X���܂�)
//	lnc		��ƃ��O�C����
//	lna		�Ǘ��҃��O�C����
//
// �l�̗�: ssl,sp,lnm
if ( 'https:' == document.location.protocol )	{ _var4.push('ssl'); }
if ( document.cookie.match(/AIPENCLI(S)?=/) )	{ _var4.push('lnc'); }
if ( document.cookie.match(/AIPENADM(S)?=/) )	{ _var4.push('lna'); }
if ( ! document.cookie.match(/MEDIA=pc/) && navigator.userAgent.match(/iPhone|Android.+Mobile Safari/) ) {
	_var4.push('sp');
}

if ( _var4.length ) {
	ga('set', 'dimension1', _var4.toString());
	_gaq.push(['_setCustomVar',		// �y�[�W
		4,							// This custom var is set to slot #1.  Required parameter.
		'page status',				// The name of the custom variable.  Required parameter.
		_var4.toString(),			// The value of the custom variable.  Required parameter.
									//  (possible values might be Free, Bronze, Gold, and Platinum)
		3							// Sets the scope to visitor-level.  Optional parameter.
	]);
}

// �J�X�^���f�B�����V���� 21-35
// ga('set', 'dimension20', dimensionValue);
var _packed_uri = _logginguri;
var _gacd = _gacd || {};
var _cdkv = {
	ty			:21,
	af			:22,
	src			:23,
	member_id	:24,
	client_id	:26,
	plan_id		:27,
	contract_id	:28,
	job_seq_no	:29,
	job_key		:30,
	revision	:31,
	entry_id	:32,
	chkcd		:33,
	edition		:34,
	special_id	:35,
	state		:36,
	contents	:37,
	block		:38
};
for (var i in _cdkv) {
	_cdkv[i] = 'dimension' + _cdkv[i];
	var re = new RegExp('\\W' + i + '=([\\w/-]+)');
	if (_packed_uri.match(re)) {_gacd[_cdkv[i]]=RegExp.$1;}
}
if (_packed_uri.match(/=mrjt_.*Entry_.+&check=\((\d+),(\d+),(\d+),(\d+)\)/)) {
	_gacd[_cdkv.client_id]	=RegExp.$1;
	_gacd[_cdkv.plan_id]	=RegExp.$2;
	_gacd[_cdkv.contract_id]=RegExp.$3;
	_gacd[_cdkv.job_seq_no]	=RegExp.$4;
};
if (_packed_uri.match(/^\/jobinfo-(\d+)-(\d+)-(\d+)-(\d+)/)) {
	_gacd[_cdkv.client_id]	=RegExp.$1;
	_gacd[_cdkv.plan_id]	=RegExp.$2;
	_gacd[_cdkv.contract_id]=RegExp.$3;
	_gacd[_cdkv.job_seq_no]	=RegExp.$4;
};
if (_packed_uri.match(/^\/company\/(\d+)/)) {_gacd[_cdkv.client_id]=RegExp.$1;}

for (var i in _gacd) { ga('set', i, _gacd[i]); }


_gaq.push(['_setLocalRemoteServerMode']);
_gaq.push(['_trackPageview', _logginguri]);


(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

if (_uaAccount) {
	if ('_gauPreSet' in window) {
		for ( var i = 0, l = _gauPreSet.length; i < l; i++ ) {
			if (_gauPreSet[i].length == 3) {
				ga(_gauPreSet[i][0], _gauPreSet[i][1], _gauPreSet[i][2]);
			}
		}
	}
	if (location.href.indexOf('state=social')!= -1 && location.pathname=='/centuserset/'){
		ga('set', 'referrer', 'http://cv-mynavi.facebook.com');
	}
	ga('require', 'displayfeatures');
	ga('send', 'pageview', _logginguri);

	// utm_* ����tracking�p�����[�^����������
	ga(
	  _gaq.push(
		function(){
			// hisotry API���T�|�[�g���Ă���u���E�U�ł̂ݎ��s
			if (window.history && window.history.replaceState) {
				do_replaceState = false;						// replaceState���邩�ǂ����̃t���O
				var url,query_string,hash,matches,domain,path;	// �e�폈���ϐ�
				var queries = [];								// replaceState���Ɏg��query string
				// utm�n�̃��X�g�i+FB�̂���j
				// ty�͈ێ��ɕύX 2014/10/20 https://stella.mycom.co.jp/trac.cgi/ticket/10084#comment:10
				var utms = {
					utm_source : true,			utm_medium : true,			utm_term : true,
					utm_content : true,			utm_campaign : true,
					fb_action_ids : true,		fb_action_types : true,		fb_source : true,
					action_object_map : true,	action_type_map : true,		action_ref_map : true,
					af : true,					src : true,					ty : true,
					search_tracking_id : true
				};

				// document.location���g�킸�Ɏ��͂�URL���
				url = document.location.toString();
				if (matches = url.match(/(.+?)#(.+)/)) {
					url=matches[1];	hash=matches[2];
				}
				if (matches = url.match(/(.+?)\?(.+)/)) {
					url=matches[1];	query_string=matches[2];
				}

				// URL��query string������΁Autm�n�̑��݂��`�F�b�N
				if (query_string) {
					query_string = query_string.split(/&/);
					for (var i =0; i < query_string.length; i++) {
						var param = query_string[i].split(/=/);
						if (typeof utms[param[0]] != 'undefined') {
							// utm�n�̂�1�ł������replaceState�t���O���I����
							do_replaceState = true;
						}
						else {
							// utm�n�łȂ����replaceState���URL�ɂ��K�v
							queries.push(query_string[i]);
						}
					}
				}

				// utm�n�̃p�����[�^������΁A�����������URL��replaceState
				if (do_replaceState) {
					// replaceState��̎w��
					if (queries.length){
						url += '?' + queries.join("&");
					}
					if (hash){
						url += '#' + hash;
					}
					// replaceState
					history.replaceState('', '', url);
				}
			}
		}
	  )
	);
}

window.onunload = function(){};	// Firefox��JavaScript�L���b�V���΍�

// �s�vcookie�폜
// https://stella.mycom.co.jp/svn/cnavi/trunk/linux/member/include/js/delete_ga_mynavi_cookies.js ��蒊�o
function deleteOldGACookies() {
	var cookieKeyArray = document.cookie.split(";");
	for (var i=0; i<cookieKeyArray.length; i++) {
		var kv = cookieKeyArray[i].split('=');
		kv[0] = kv[0].replace(/^ +/, '');

		// .tenshoku.mynavi.jp(old) Google Analytics
		if (kv[0].indexOf('__utm')==0 && kv[1].indexOf('207050262')==0) {
			document.cookie = kv[0] + '=.; expires=' + (new Date()).toGMTString() + '; domain=.tenshoku.mynavi.jp; path=/'

		}
	}
}
deleteOldGACookies();

// �C�x���g ga/_gaq �܂Ƃ߃g���b�N�p function
// ga_track_ev(
//	�l				�^		�K�{		����
//	Category		String	�K�{		�ʏ�͑���Ώۂ̃I�u�W�F�N�g�i��: button�j
//	Action			String	�K�{		����̎�ށi��: click�j
//	Label			String	�I�v�V����	�C�x���g�̕��ނɕ֗��i��: nav buttons�j
//	Value			Number	�I�v�V����	�����l���w�肷��K�v������܂��B�J�E���g����n���ۂɕ֗��ł��i��: 4�j
//	nonInteraction	Boolean	�I�v�V����	true�̏ꍇ�A�C�x���g���������Ă��ق��Ƀy�[�W�r���[�����Ȃ���Β��A�ƂȂ�܂��i��: true�j
// );
// �� ga_track_ev('cat1', 'ac');
// �� ga_track_ev('cat2', 'ac', 'label');
// �� ga_track_ev('cat3', 'ac', 'label', 67);
// �� ga_track_ev('cat4', 'ac', null   , 67);
// �� ga_track_ev('cat5', 'ac', 'label', 67,   true);
// �� ga_track_ev('cat6', 'ac', 'label', null, true);
function ga_track_ev(ct, ac, lb, vl, noint) {
	if (_uaAccount && ct && ac) {
		ga('send', 'event', ct, ac, { eventLabel:lb, eventValue:vl, nonInteraction:noint });
		_gaq.push(['_trackEvent', ct, ac, lb, vl, noint]);
	}
}

// ���zPV ga/_gaq �܂Ƃ߃g���b�N�p function
// ga_track_pv(
//	�l	�^		�K�{		����
//	URL	String	�K�{		1�����ڂ�'/'�łȂ���΂Ȃ�܂���
// );
// �� ga_track_pv('/dsbd/');
function ga_track_pv(uri) {
	if (_uaAccount && uri.match('^\/')) {
		ga('send', 'pageview', uri);
		_gaq.push(['_trackPageview', uri]);
	}
}
