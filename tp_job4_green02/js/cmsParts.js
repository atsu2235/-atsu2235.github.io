*---------------------------------
 * cmsParts.js
 ---------------------------------*/
// ログイン状態
var _login = false;

/**
 * グローバルナビ表示
 */
function globalHeader() {
    var headerType = "";
    //現在地取得
    for (var i = 1; i <= 6; i++) {
        if ($$(".gnav .gnav0" + i).hasClass("current")) {
            if (i != 2) {
                headerType = i;
            }
            break;
        }
    }
    //グローバルナビ取得
    $$.ajax({
        type: "GET",
        url: "/dcfront/cms/cmsGlobalHeader/",
        dataType: "html",
        data: {"tabType": headerType},
        cache: false,
        success: function(data) {
            if(data != ""){
                //グロナビ置換
                $$('.gnav').empty().html(data);
                //イベント設定
                $$(".gnav").ready(function() {
                    $$('.gnavParent').hover(
                        function(){ $$(this).children('.megaNav').show();},
                        function(){ $$(this).children('.megaNav').hide();}
//                        function(){ $$(this).children('.megaNav').stop().slideDown(200);},
//                        function(){ $$(this).children('.megaNav').stop().slideUp(200);}
                    );
                    //タブクリック時は指定のリンク先に遷移 ※紹介求人トップは除外
                    $$('.gnavParent:not(.gnav02)').click(function(){
                        location.href = $$(this).attr('data-link');
                    });
                    //タブ内の項目クリック時は無効化
                    $$('.gnavParent .megaNav').click(function(e) {
                        e.stopPropagation();
                    });
                });
            }
        }
    });
}

/**
 * 右上ヘッダーを表示
 */
function rightHeader() {
	$$.ajax({
		type: "GET",
		url: "/dcfront/cms/cmsRightHeader/",
		dataType: "html",
		cache: false,
		success: function(data, status, xhr) {
			var login = xhr.getResponseHeader("X-Doda-Login");
			if (login === "true") {
				// ヘッダー入れ替え
				$$('.headerRight.clrFix').empty().html(data);

				// rresume自動作成を表示
				autoResumeDisp();
				
			} else {
				// 件数表示スクリプト追加
				$$('.headerRight.clrFix').append(data);
			}
		}
	});
}

/**
 * resume自動作成を表示
 */
function autoResumeDisp() {
	// resume自動作成判定
	var tempPathname = window.location.pathname;
	if (tempPathname == '/') {

		$(function() {
			$.ajax({
				type: 'GET',
				url: '/dcfront/mypage/autoResumeAjax/',
				dataType: 'json',
				success: function(data) {
					if (data.isAutoResume == "true") {
						$('#auto_resume_notification').show();

						$(
							'#auto_resume_certificationClose_btn , .headerInr .functions li '
						).click(function() {
							$('#auto_resume_notification').hide();
						});
						$('#auto_resume_notification').click(function(event) {
							event.stopPropagation();
						});
					}
				},
			});
		});
	}
}

/**
 * パーソナライズエリアを表示
 * @param elementId エレメントID
 * @param eventId 効果測定用のeventId
 * @param position 効果測定用positionのprefix
 * @param name カスタムリンク
 * @param title タイトル
 */
function mypagePersonalized(elementId, eventId, position, name, title) {
	if(eventId == undefined) {
		eventId = '';
	}
	if(name == undefined) {
		name = '';
	}
	if(elementId == undefined) {
		elementId = '';
	}
	if(position == undefined) {
		position = '';
	}
	if(title == undefined) {
		title = '';
	}
	
    // パーソナライズエリア
    $$.ajax({
        type: "GET",
        url: "/dcfront/cms/siteTopControl/",
        dataType: "json",
        cache: false,
        success: function(data) {
            if (data.isSundayOrWednesday) {		
                // 日・水の場合、締切間近を表示
                $$("#deadline").removeClass("deadlineDisplay");
                $$("#deadlineCount").html(data.deadlineCount.toLocaleString());		
            }
            _login = data.login;
            if(_login) {
                // ログイン済み
                $$(".loginBefore").parent().css("display", "none");
                // お知らせ
                if (data.scheduledMessageList.length > 0) {
                    var noticeHtml = "<li><span>お知らせ</span>";
                    for(var i = 0; i < data.scheduledMessageList.length; i++) {
                        noticeHtml += data.scheduledMessageList[i];
                    }
                    noticeHtml += "</li>";
                    $$(".topNotice").html(noticeHtml);
                }
                // パーソナライズエリア
                var loginHtml = "<iframe class='topPersonalizeArea' src='/dcfront/cms/mypagePersonalized/?eventId="+eventId+"&name="+name+"&elementId="+ elementId + "&position="+ position + "&title="+ title +"' frameborder='0'></iframe>";
                $$(".loginAfter").append(loginHtml);
            }
        }
    });
};

/**
 * レコメンドパネル表示
 * @param elementid レコメンドパネルを表示するタグID
 * @param recommendType レコメンド種別
 * @param dispType 表示種別
 * @param effectEventId イベントID
 * @param effectPosition 効果測定場所Prefix
 * @param effectName 画面名
 * @param conditionItems レコメンド案件ID
 * @param recommendTitle レコメンドタイトル
 * @param envFlag        環境フラグ
 *                       (sp：SPレコメンドパネル／pc_DodaFront：新基盤レコメンドパネル／pc_dcfront：共通サイト基盤レコメンドパネル)
 */
function recommend(elementid, recommendType, dispType, effectEventId, effectPosition, effectName, conditionItems, recommendTitle, envFlag) {
    var url = "/dcfront/recommend/ajax/recommendPanel/";
    var flag = envFlag + "";
    flag = flag.toLowerCase();
    
    if($("#"+elementid).size() == 0) {
        return;
    }

    $$.ajax({
        type: "POST",
        url: url,
        dataType: "html",
        cache: false,
        data: {
            "recommendType": recommendType,
            "dispType": dispType,
            "effectEventId": effectEventId,
            "effectPosition": effectPosition,
            "effectName": effectName,
            "conditionItems": conditionItems,
            "location": window.location.href
        },
        success: function(data) {
            //空白が戻ってる場合、エラーもしくは、レコメンドが存在しないため
            //以後の処理をやめてデフォルトのレコメンドを呼出す
            if(data == '') {
                return;
            }

            if(flag == "pc_dodafront") {
                $$("#" + elementid).replaceWith(data);
            } else {
                $$("#" + elementid).html(data);
            }
            recommendCreateUsrclk(elementid);
            recommendJoinParam();
        },
        complete: function(){
            //レコメンド取得でエラーになった場合、
            //デフォルトのレコメンドパネルを呼出す
            if(flag == "pc_dodafront") {
                //新基盤(タグ全体が切り替われる)
                //recommendタグが切り替われていない(レコメンドパネル付着に失敗)
                if($("#"+elementid).size() != 0 && recommendType != "bookmark_list") {
                    if(typeof defaultRecommend == 'function' && defaultRecommend != null) {
                        defaultRecommend(elementid);
                    }
                }
            } else if (flag == "nodefault") {
            // デフォルトレコメンドを呼ばない
            } else if($("#"+elementid).children().size() == 0 && recommendType != "bookmark_list"){
                //共通サイト基盤(タグの子要素として加えられる)
                //レコメンドパネルがタグ下に入っていない
                if(typeof defaultRecommend == 'function' && defaultRecommend != null) {
                    defaultRecommend(elementid);
                }
            }
        }
    });
}

/**
 * コンテンツレコメンド表示
 * @param recommendType レコメンド種別
 * @param callback コンテンツレコメンド取得後の呼び出し関数
 */
function contentsRecommend(recommendType, callback) {
    $$.ajax({
        type: "POST",
        url: "/dcfront/recommend/ajax/contentsRecommendPanel/",
        dataType: "json",
        cache: false,
        data: {
            "recommendType": recommendType,
            "location": window.location.href
        },
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * 右上ヘッダーの件数を表示
 */
function getHeaderCount(){
    $$.ajax({
        type : "GET",
        url : "/dcfront/cms/cmsMemberInfo/",
        dataType : "json",
        data : {"keys" : "bookmarkCnt,jobHistoryCnt"},
        cache : false,
        success : function(data) {
            // 検討リスト件数
            if (data.bookmarkCnt > 0 && data.bookmarkCnt <= 99) {
                $$(".btnHeaderStar").attr("data-count", data.bookmarkCnt);
            }
            if (data.bookmarkCnt > 99) {
                $$(".btnHeaderStar").attr("data-count", "99+");
            }
            // 閲覧履歴件数
            if (data.jobHistoryCnt > 0 && data.jobHistoryCnt <= 99) {
                $$(".btnHeaderHistory").attr("data-count", data.jobHistoryCnt);
            }
            if (data.jobHistoryCnt > 99) {
                $$(".btnHeaderHistory").attr("data-count", "99+");
            }
        }
    });
}

/**
 * JobCount取得
 * @param fieldName フィールド名
 * 
 */
function jobCount(fieldName){

    $$.ajax({
        type: "GET",
        url: "/dcfront/cms/jobCount/",
        dataType: "json",
        data: {"fieldName": fieldName},
        cache: false,
        success: function($json) {
            var tagetString = $json;
            for (var returnField in tagetString) {
              for (var returnCategory in tagetString[returnField]){
                $$("#" + returnCategory).html(tagetString[returnField][returnCategory].toLocaleString());
              };
            };
        }
    });
    jobCountAll();
};
/**
 * JobCountAll取得
 */
function jobCountAll() {
    $.ajax({
        type: "POST",
        url: "/DodaFront/uc/CommonAllCnt.action",
        dataType: "json",
        data: {"siteid": "10","cnttype":"*"},
        cache: false,
        success: function($json) {
            $("#ALL_JOB_COUNT").html($json.jobCount.toLocaleString());
            if(document.getElementById('UPDATE_AT')){
                document.getElementById('UPDATE_AT').textContent = createUpdateAt($json.updateAt);	
            }
        }   
    }); 
    
	const createUpdateAt = function(dateText) {
		if(!dateText) return null;
		const date = new Date(dateText);
		const dayNames = '日月火水木金土';
		return date.getFullYear() + "/" + (date.getMonth() +1) + "/" + date.getDate() + "(" + dayNames[date.getDay()] + ")更新";
	}
}

/**
 * ReturnString呼出
 * @param elementid 設定するエレメントID
 * @param p1 p1パラメータ
 */
function returnString(elementid, p1){
    $$.ajax({
        type: "GET",
        url: "/dcfront/cms/returnString/",
        dataType: "text",
        data: {"p1": p1},
        cache: false,
        success: function(data) {
            $$("#" + elementid).html(data);
        }
    });    
};

/**
 * ログインセッション同期用スクリプト出力
 */
function sessionSync(){
    document.write("<script src='");
    document.write("/dcfront/common/sessionSync/");
    document.write("'></script>");
};
sessionSync();


/**
 * 応募フォームボタン押下時の
 * サイトカタリスト送信パラメータの設定を行う
 *
 * @param eventId イベントID
 * @param position 応募フォームボタン位置
 * @param name 画面名
 */
function setEffect(eventId, position, name) {
	var s=s_gi('intetenshokuintecojp');
    s.linkTrackVars='prop1,prop23,prop69,eVar23,eVar78';
    s.linkTrackEvents='event5,event8,event70,event71,event72,event73,event74,event81,event82,event135,event137';	
    s.prop23=position;
	s.eVar23=position;
	s.events=eventId;
	try{
		s.tl(this,'o',name);
	}
	catch(e){
		// URIエンコードによる例外発生時は無視する。
	}
	
	// GA送信
	window.dataLayer = window.dataLayer || [];
	dataLayer.push({
	    'click_Label': eventId,
	    'click_Action': position,
	    'click_Category': name
	});
	//GTM Trigger
	dataLayer.push({'event':'setEffect'});
}
function siteRecommendTracking(recommendType,effectName){

    //Set Param
    window.sc = window.sc || {};
    window.sc.recommendLogic = recommendType;
    window.sc.trackParam = effectName;

    //Execute Track AA
    window.s.tl(true,'o','siteRecommendTracking');

    //delete Param
    window.sc.recommendLogic = "";
    window.sc.trackParam = "";

    //Execute Track GA
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        'siteRecommendLogic': recommendType,
        'siteRecommendTrackParam': effectName,
        'event': 'siteRecommendTracking'
    });

}

/**
 * レコメンド有無確認
 */
function getRecommendForListDisp(recommendType, callback) {
  $.ajax({
    type: "POST",
    url: "/dcfront/recommend/ajax/recommendPanel/",
    dataType: "json",
    cache: false,
    data: {
      "recommendType": recommendType,
      "dispType": "json",
      "effectEventId": "event70",
      "effectPosition": "Rekome_sp",
      "effectName": "none",
      "conditionItems": "",
      "location": window.location.href
    },
    success: function (data) {
      if (data){
        callback(data);
      }
    },
    error: function () {
    },
  });
}

/**
 * レコメンドのリンクにusrclkパラメータを付与
 */
function recommendCreateUsrclk(elementid){
    var elements = document.querySelector("input#deviceLoginStatus");
    if(elements){
        //ログイン状態の取得
        var deviceLoginStatus = elements.value;
        if(deviceLoginStatus){
            //レコメンドのaタグにrecommendUsrclkがあるものを取得する
            var recommendUrl = "";
            //検索結果一覧画面の場合
            if(deviceLoginStatus == "PC-loginJobSearchList_" || deviceLoginStatus == "PC-logoutJobSearchList_") {
                recommendUrl = document.querySelectorAll("a.recommendUsrclk");
            //気になるリスト画面の場合
            } else if(deviceLoginStatus == "PC-loginKininaruListMediaScout_" || deviceLoginStatus == "PC-logoutKininaruListMediaScout_") {
                recommendUrl = document.getElementById(elementid).querySelectorAll("a.recommendUsrclk");
            }
            if(recommendUrl){
                for(var i = 0; i < recommendUrl.length; i++) {
                    if (recommendUrl[i].getAttribute("duplicatedefendRecommendReqparam") != null) {
                            //重複した場合は設定を行わない
                    }
                    else {
                        recommendUrl[i].setAttribute("duplicatedefendRecommendReqparam", "true");
                        var reqparamValue = recommendUrl[i].getAttribute('data-reqparam');
                        try{
                            reqparamValue = JSON.parse(reqparamValue);
                            param_length = reqparamValue.parameter.length;
                            var start = "";
                            var end = "";
                            // レコメンドが表示されている画面により付与するusrclkパラメータを場合分け
                            // 検索結果一覧画面
                            if(deviceLoginStatus == "PC-loginJobSearchList_" || deviceLoginStatus == "PC-logoutJobSearchList_") {
                                start = "usrclk_searchList";
                                end = "searchResultFooterAddedArea_recommend";
                            // 気になるリスト画面
                            } else if (deviceLoginStatus == "PC-loginKininaruListMediaScout_" || deviceLoginStatus == "PC-logoutKininaruListMediaScout_") {
                                start = "usrclk_kininaruList";
                                // 画面上部
                                if (elementid == "recommend3") {
                                    end = "kininaruListHeaderArea_recommendArea_list";
                                    // 画面下部
                                } else if (elementid == "recommend" || elementid == "recommend2") {
                                    end = "kininaruListFooterArea_recommendArea";
                                }
                            }
                            // 対象画面によってパラメータを出し分ける
                            var usrclk_param = { key : start, val : deviceLoginStatus + end};                        
                            reqparamValue.parameter[param_length] = usrclk_param;
                            recommendUrl[i].setAttribute("data-reqparam", JSON.stringify(reqparamValue));
                        }
                        catch(e){
                            //処理エラーを無視する
                        }
                    }
                }
            }
        }
    }
}

/**
 * レコメンドのリンククリック時に、data-reqparamに設定されたパラメータをURLに付与する
 */
function recommendJoinParam() {

    var linkTag = document.querySelectorAll('a.recommendUsrclk');
    var normalizationURL;
    var tmpKey;
    var tmpVal;

    for (var i = 0; i < linkTag.length; ++i) {
        if (linkTag[i].getAttribute("duplicatedefend") != null) {
                //重複した場合は設定を行わない
        }
        else {
            linkTag[i].setAttribute("duplicatedefend", "true");
            linkTag[i].addEventListener('click', function (e) {
            e.preventDefault();
            try{
                var parameters = JSON.parse(this.getAttribute('data-reqparam'));
                normalizationURL = this.href.split('?')[0];

                if(parameters.hasOwnProperty('parameter')) {
                    for (j = 0; j < parameters.parameter.length; ++j) {
                        tmpKey = parameters.parameter[j]['key'];
                        tmpVal = parameters.parameter[j]['val'];
                        if (j === 0) {
                            normalizationURL += '?' + tmpKey;
                            if (tmpVal !== '') {
                                normalizationURL += '=' + tmpVal;
                            }
                        } else {
                            normalizationURL += '&' + tmpKey;
                            if (tmpVal !== '') {
                                normalizationURL += '=' + tmpVal;
                            }
                        }
                    }
                }

                if (this.getAttribute('target') === '_blank') {
                    window.open(normalizationURL);
                } else {
                    location.href = normalizationURL;
                }
            }
            catch(e){
                //処理エラーを無視する
            }
            });
        }
    }
};
/**
 * ページ描写が終わったタイミングで再度パラメータ付与の処理を行う
 */
window.addEventListener('load', function () {
    try {
        var a = document.querySelectorAll("input#recommendIdx");
        for (var i = 0; i < a.length; i++) {
            //レコメンドIDが存在するかの確認
            if(document.querySelector("#recommend3")){ // 一例。
                recommendCreateUsrclk("recommend3");
            }
            else if(document.querySelector("#recommend2")){
                recommendCreateUsrclk("recommend2");
            }
            else if(document.querySelector("#recommend")){
                recommendCreateUsrclk("recommend");
            }
            else{
        	    recommendCreateUsrclk(null);
        	}
        }
        recommendJoinParam();
    }
    catch(e){
    	//処理エラーを無視する
    }
}, false);