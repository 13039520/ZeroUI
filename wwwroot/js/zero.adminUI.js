(function ($) {
    var win = window, topWin = window, userAgent = navigator.userAgent;
    while (topWin.parent && topWin.parent != topWin) {
        topWin = topWin.parent;
    }
    var  isFirefox = /\bFirefox\/\d+/i.test(userAgent),
        isIE = /(MSIE \d)|(rv:11)/i.test(userAgent),
        isIE567 = /(MSIE [567])|(rv:11)/i.test(userAgent),
        isEdge = /\bEdge\/\d+/i.test(userAgent),
        isTopWin = topWin === win;

    var UI = {};

    UI.singleTabPageReplacementTips = 'The current page is locked. There may be unfinished tasks. Are you sure you want to replace it? ';

    UI.isMultiTabs = false;

    UI.mainPage = function () {
        var rtabs, riframes, wSize, isMultiTabs=true;
        var winResize = function (isClick) {
            wSize = $(win).getSize();
            if (undefined === isClick) {
                if (wSize.width < 1024) {
                    $('zero_ap_layout_main').addClass('zero_ap_layout_left_hide');
                } else {
                    $('zero_ap_layout_main').removeClass('zero_ap_layout_left_hide');
                }
            }
            var lSize = $('zero_ap_layout_left').getSize();
            $('zero_ap_layout_left_menu_init').cssText('height:' + (wSize.height - 66 - 10 - 3) + 'px');
            $('zero_ap_layout_right').cssText('width:' + (wSize.width - (wSize.width>1024?lSize.width:0)) + 'px');
            $('zero_ap_layout_right_iframes').cssText('height:' + (wSize.height - (isMultiTabs?66:34)-2) + 'px');
        },
        selectionEmpty = function () {
            document.selection ? document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges()
        },
        fsc = function (n) {
            if (isIE) { return; }
            if (n) {
                var ele = document.documentElement;
                if (ele.requestFullscreen) {
                    ele.requestFullscreen();
                }
                else if (ele.mozRequestFullScreen) {
                    ele.mozRequestFullScreen();
                }
                else if (ele.webkitRequestFullScreen) {
                    ele.webkitRequestFullScreen();
                }
                else if (ele.msRequestFullscreen) {
                    ele.msRequestFullscreen();
                }
            } else {
                var doc = document;
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                }
                else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                }
                else if (doc.webkitCancelFullScreen) {
                    doc.webkitCancelFullScreen();
                }
                else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                }
            }
        },
        menuInit = function () {
            var menu = $("zero_ap_layout_left_menu");
            if (menu.length !== 1) { return; }
            $(menu, "a").foreach(function (a) {
                var target = $(this).attribute("target");
                if (target != 'dialog') { target = ''; }
                $(this.parentNode).attribute('target', target).attribute("link", $(this).attribute("href")).html($(this).html()).attribute("id", "nav" + $.guid())
            });
            menu.addEvent("click", function (a) {
                a = a || event;
                a = a.target || a.srcElement;
                if (a.nodeName) {
                    var d = function () {
                        var a = $(this.parentNode);
                        a.hasClass("zero_open") ? (a.removeClass("zero_open"), a.hasClass("zero_selected") ? a.addClass("zero_selected_close") : a.removeClass("zero_selected_close")) : a.addClass("zero_open").removeClass("zero_selected_close");
                        if (isEdge) {
                            var dd = this.parentNode.getElementsByTagName('dd'),
                                s = this.parentNode.className.indexOf('zero_open') > -1 ? 'block' : 'none';
                            for (var i = 0; i < dd.length; i++) {
                                dd[i].style.display = s;
                            }
                        }
                    },
                    c = function () {
                        var a = $(this),
                            d = $(this.parentNode);
                        if ($(a).attribute('target') === 'dialog') {
                            dialog.loadIframe($(a).text(), $(a).attribute("link"), 100000, 100000);
                            return;
                        }
                        if (wSize && wSize.width < 1024) { btn.fireEvent('click'); }
                        if (!isMultiTabs) {
                            var num = $(rtabs).find('class=zero_tabs_single').attribute('id');
                            if (num) { num = num.replace('tab', ''); }
                            var num2 = $(this).attribute('id').replace('nav', '');
                            if (num == num2) { return;}
                            var locked = $(rtabs).find('class=zero_tabs_single').attribute('locked');
                            if (locked) {
                                var _this = this;
                                dialog.confirm(
                                    $.lan.tips,
                                    '<p style="font-size:12px;">'+UI.singleTabPageReplacementTips+'</p>',
                                    function (flag) {
                                        if (!flag) { return; }
                                        $(menu).find('dd').removeClass('zero_selected');
                                        $(menu).find('dl').removeClass('zero_selected');
                                        $(_this).addClass('zero_selected');
                                        $(d).addClass('zero_selected');
                                        menuOpen(_this);
                                    },320);
                            } else {
                                $(menu).find('dd').removeClass('zero_selected');
                                $(menu).find('dl').removeClass('zero_selected');
                                $(this).addClass('zero_selected');
                                $(d).addClass('zero_selected');
                                menuOpen(this);
                            }
                            return;
                        }
                        a.hasClass("zero_selected") ? (a = $(this).attribute("id").replace("nav", ""), tabSelected($("tab" + a))) : (a.addClass("zero_selected"), d.hasClass("zero_selected") || d.addClass("zero_selected"), menuOpen(this));
                    };
                    switch (a.nodeName.toLowerCase()) {
                        case "dt":
                            d.apply(a, []);
                            break;
                        case "dd":
                            c.apply(a, [])
                    }
                }
            });
            var btn = $('zero_ap_layout_left_ctrl_btn');
            if (btn.length != 1) { return; }
            btn.addEvent('click', function (e) {
                var main = $('zero_ap_layout_main');
                if ($(main).hasClass('zero_ap_layout_left_hide')) {
                    $(main).removeClass('zero_ap_layout_left_hide');
                } else {
                    $(main).addClass('zero_ap_layout_left_hide');
                }
                winResize(null,true);
            });
        },
        menuSelected = function () {
            var a = $('zero_ap_layout_left_menu').find("dd");
            if (1 < a.length) {
                a.hasClass("zero_selected") || $(a[0]).addClass("zero_selected");
                var c = function () {
                    var a = $(this.parentNode);
                    a.hasClass("zero_open") ? a.hasClass("zero_selected") || a.addClass("zero_selected") : a.addClass("zero_selected").addClass("zero_selected_close");
                    menuOpen(this)
                };
                a.filter("class=zero_selected").foreach(function (a) {
                    c.apply(this, arguments)
                });
                1 > a.length && c.apply(a[0], arguments)
            }
        },
        menuOpen = function (menu) {
            var num = $(menu).attribute("id").replace("nav", ""),
                title = $(menu).html(),
                src = $(menu).attribute("link"),
                parent = $(menu).parent().find('dt', 1).first().html();
            if (!isMultiTabs) {
                var pTitle = $(menu).parent().find('dt').html().replace(/[<>]/g, '');
                $(rtabs).html('<div class="zero_tabs_single" id="tab'+num+'"><span class="zero_bg_icon zero_bg_icon_home"></span><span>' + pTitle + '</span><span class="gt">&gt;&gt;</span><span>' + title.replace(/[<>]/g, '') + '</span></div>');
                if ($(riframes).find("iframe").length) {
                    $(riframes).find("iframe")[0].id = 'iframe'+num;
                    $(riframes).find("iframe")[0].src = src;
                    onSelectPage({ name: title, parent: parent, src: src });
                    return;
                }
                var h = function () {
                    iframe[0].style.visibility = "visible";
                };
                var iframe = $.htmlStrToDom('<iframe frameBorder="0" class="zero_selected" style="visibility:hidden;" allowTransparency="true" src="' + src + '" id="iframe' + num + '"></iframe>');
                iframe[0].attachEvent ? iframe[0].attachEvent("onload", h) : iframe[0].onload = h;
                iframe.appendTo(riframes[0]);
                onSelectPage({ name: title, parent: parent, src: src });
                return;
            }
            tabCreate(title, src, num);
            tabSelected($(rtabs).find("class>zero_tab", 1).foreach(function (n) {
                $(this).attribute("n", n)
            }).last()[0]);
        },
        tabsInit = function () {
            if (!isMultiTabs) {
                rtabs = $("zero_ap_layout_right_tabs").cssText('height:0;');
                riframes = $("zero_ap_layout_right_iframes");
                return;
            }
            var d = $("zero_ap_layout_right_tabs").html('<div class="zero_r_arrow_l"><span class="zero_arrow_l zero_bg_icon zero_bg_icon_arrow_left3"></span></div><div class="zero_r_tabs_init"><div class="zero_init"><div class="zero_tabs"></div></div></div><div class="zero_r_arrow_r"><span class="zero_arrow_r zero_bg_icon zero_bg_icon_arrow_right3"></span></div>'),
            a = rtabs = $(d).find("class=zero_tabs"),
            b = riframes = $("zero_ap_layout_right_iframes"),
            e = $(d).find("class=zero_arrow_l"),
            c = $(d).find("class=zero_arrow_r");
            d.addEvent("click", function (d) {
                d = d || event;
                d = d.srcElement || d.target;
                if (d.className) {
                    var n=d.className.toLowerCase();
                    if(n.indexOf('zero_arrow_l')>-1){
                        $(a).find("class>zero_tab", 1);
                        d = parseInt($(a)[0].style.marginLeft, 10);
                        cl = (d ? d : 0) + 120;
                        0 < cl && (cl = 0);
                        $(a).cssText("margin-left:" + cl + "px");
                    }else if(n.indexOf('zero_arrow_r')>-1){
                        var c = $(a).find("class>zero_tab", 1);
                        d = (d = parseInt($(a)[0].style.marginLeft, 10)) ? d : 0;
                        var b = $($(a)[0].parentNode).getSize().width,
                            c = 120 * c.length;
                        c > b && (b = c - b + d, 0 < b && (d -= 120 < b ? 120 : b, $(a).cssText("margin-left:" + d + "px")));
                    }else if(n.indexOf('zero_tab_text')>-1){
                        tabSelected(d.parentNode);
                    }else if(n.indexOf('zero_tab_close')>-1){
                        tabClose(d.parentNode)
                    }
                }
            }).addEvent("dblclick", function (a) {
                a = a || event;
                a = a.srcElement || a.target;
                selectionEmpty();
                if (a.className) switch (a.className.toLowerCase()) {
                    case "zero_tab_text":
                        tabFitShow(a.parentNode)
                }
            })
        },
        tabCreate = function (title, src, num) {
            if (!num) { num = $.guid(); }
            $.htmlStrToDom('<div class="zero_tab" id="tab' + num + '"><span class="zero_tab_text">' + title.replace(/[<>]/g,'') + '</span><span class="zero_tab_close" title="关闭">x</span></div>').appendTo(rtabs[0]);
            var h = function () {
                iframe[0].style.visibility = "visible";
                try {
                    $(iframe[0].contentWindow).addEvent('onscroll', function (e) {
                        var supportPageOffset = this.pageXOffset !== undefined;
                        var isCSS1Compat = ((this.document.compatMode || "") === "CSS1Compat");
                        var x = supportPageOffset ? this.pageXOffset : isCSS1Compat ? this.document.documentElement.scrollLeft : this.document.body.scrollLeft;
                        var y = supportPageOffset ? this.pageYOffset : isCSS1Compat ? this.document.documentElement.scrollTop : this.document.body.scrollTop;
                        if (x > 0 || y > 0) {
                            $(iframe[0]).attribute('sl', x).attribute('st', y);
                        }
                    });
                } catch (e) {}
            };
            var iframe = $.htmlStrToDom('<iframe frameBorder="0" style="visibility:hidden;" allowTransparency="true" src="' + src + '" id="iframe' + num + '"></iframe>');
            $(riframes).find("iframe").removeClass("zero_selected");
            iframe[0].attachEvent ? iframe[0].attachEvent("onload", h) : iframe[0].onload = h;
            iframe.appendTo(riframes[0]);
            $(rtabs).cssText('width:'+($(rtabs,'div',1).length*120)+'px')
        },
        tabSelected = function (tab) {
            var c = $(tab).attribute("id").replace("tab", ""),
                f = parseInt($(tab).attribute("n"), 10),
                menu = $('nav' + c),
                title = $(menu).html(),
                src = $(menu).attribute('link'),
                parent = $(menu).parent().find('dt').first().html();
            $(rtabs).find("class>zero_tab", 1).removeClass("zero_selected").filter("n=" + f).addClass("zero_selected");

            onSelectPage({ name: title, parent: parent, src: src });

            var e = $(rtabs)[0].style.marginLeft,
                e = parseInt(e ? e : 0, 10),
                f = 1 > f ? 0 : 120 * f,
                h = $(rtabs).parent().getSize().width - 120,
                g = e + f;
            if (g > h || 0 > g) {
                var k = $.htmlStrToDom('<div style="width:100%;height:100%;overflow:hidden;position:absolute;z-index:9999;background:#fff;filter:alpha(opacity=10);opacity:0.01;left:0;top:0;"></div>').appendTo();
                var p = $(rtabs).parent().getAbsPoint();
                var v = g > h ? 0 - f + h : 0 - f;
                $(rtabs).changePosition({
                    to: { x: p.x + v, y: p.y },
                    isFast: true,
                    change: function (point, rate, step, distance) {
                        $(rtabs).cssText("margin-left:" + (point.x - p.x) + "px");
                    },
                    end: function () {
                        $(riframes).find("iframe").removeClass("zero_selected");
                        $("iframe" + c).addClass("zero_selected");
                        k.remove();
                    }
                });

            } else { $(riframes).find("iframe").removeClass("zero_selected"), $("iframe" + c).addClass("zero_selected"); }

            var sl = $("iframe" + c).attribute('sl'),
                st = $("iframe" + c).attribute('st'),
                x = sl ? parseInt(sl) : 0,
                y = st ? parseInt(st) : 0;
            if (x > 0 || y > 0) {
                $("iframe" + c)[0].contentWindow.scrollTo(x, y);
            }

        },
        tabClose = function (tab) {
            if ($(tab).attribute("locked")) return dialog.tips('<center style="color:#f00;">the tab is locked</center>');
            var c = $(tab).attribute("id").replace("tab", ""),
                b = parseInt($(tab).attribute("n"), 10),
                f = $(tab).hasClass("zero_selected"),
                e = $(rtabs).find("class>zero_tab", 1);
            if (2 > e.length) return dialog.tips('<center style="color:#f00;">the tab is can not removed</center>');
            var h = $("iframe" + c);
            $(tab).remove();
            c = $("nav" + c);
            if (c.length) {
                c.removeClass("zero_selected");
                $(c[0].parentNode).find("dd").hasClass("zero_selected") || $(c[0].parentNode).removeClass("zero_selected").removeClass("zero_selected_close")
            }
            e = $(rtabs).find("class>zero_tab", 1).foreach(function (a) {
                $(this).attribute("n", a)
            });
            if (e.length && f) {
                b >= e.length && (b = e.length - 1);
                c = $(e[b]).addClass("zero_selected").attribute("id").replace("tab", "");
                $("iframe" + c).addClass("zero_selected");
                parseInt($(rtabs)[0].style.marginLeft, 10) < (1 > b ? 0 : 0 - 120 * b) && tabSelected(e[b])
            }
            try {
                $(h[0].contentWindow).removeEvent('onscroll');
            } catch (e) {}
            h.remove();
        },
        tabFocus = function (tab) {
            tabSelected(tab);
        },
        tabFitShow = function (tab) {
             var id = 'zero_ap_fit_back', c = $(id);
             if (c.length) { c.fireEvent("click"); }
             else {
                 var b;
                 if (isStr(tab)) {
                     b = $("iframe" + tab).addClass('zero_ap_fit')
                 } else {
                     b = $("iframe" + $(tab).attribute("id").replace("tab", "")).addClass('zero_ap_fit');
                 }
                 var f = $.htmlStrToDom('<a id="zero_ap_fit_back">退出全屏</a>').insertAfter(b[0]);
                 var e = document.title;
                 iframeTitle = $(tab).find("class=zero_tab_text").html();
                 try {
                     var h = b[0].contentWindow.document.title;
                     h && (iframeTitle = h)
                 } catch (g) { }
                 document.title = iframeTitle;
                 fsc(true);
                 $(f).addEvent("click", function () {
                     document.title = e;
                     var a = $(window).getSize().height - 64;
                     $(this).removeEvent("click");
                     $(b[0]).removeClass("zero_ap_fit");
                     f.remove();
                     fsc(false);
                 })
             }
            };
        var onSelectPage = function (obj) { };

        return new function () {
            this.isTopWin = isTopWin;
            this.init = function (config) {
                if (!$(document.body).hasClass("zero_top_page")) { return; }
                var _default = {
                    isMultiTabs: true,
                    tabReplaceTips: '是否确定替换页面？',
                    onSelectPage: function (obj) { }
                };
                if (!config) { config = _default; }
                if (config.isMultiTabs === undefined) { config.isMultiTabs = _default.isMultiTabs; }
                if (!isStr(config.tabReplaceTips) || config.tabReplaceTips.length > 0) {
                    UI.singleTabPageReplacementTips = config.tabReplaceTips = _default.tabReplaceTips;
                }
                if (!isFunc(config.onSelectPage)) {
                    config.onSelectPage = _default.onSelectPage;
                }
                onSelectPage = config.onSelectPage;
                UI.isMultiTabs = isMultiTabs = config.isMultiTabs;
                $(win).addEvent("resize", function (e) { winResize() });
                winResize();
                menuInit();
                tabsInit();
                menuSelected();
            };
            this.isMultiTabs = isMultiTabs;
            this.tabClose = function (num) {
                if (!isMultiTabs) {
                    return;
                }
                num && (num = $("tab" + num), num.length && tabClose(num[0]));
            };
            this.tabFocus = function (num) {
                if (!isMultiTabs) {
                    return;
                }
                num && (num = $("tab" + num), num.length && tabFocus(num[0]));
            };
            this.tabFitShow = function (num) {
                if (!isMultiTabs) {
                    tabFitShow(num);
                    return;
                }
                num && (num = $("tab" + num), num.length && tabFitShow(num[0]))
            };
            this.tabLock = function (num, isLock) {
                if (!num) { return; }
                var b = $("tab" + num);
                b.length && (isLock ? b.attribute("locked", 1) : b.removeAttribute("locked"));
            };
        }();
    }();

    UI.tabIframePage = new function () {
        var _this = this,
        pageReadyFunc = function () {
            $('zero_data_list_header').find('select').foreach(function (num) { $.UI.select(this); });
        };
        this.isTabIframePage = win !== topWin;
        this.topWin = topWin;
        this.tabIframeNode = this.tabNumber = null;
        this.tabFocus = function (num) {
            isNaN(num) ? num = 0 : (num = parseInt(num, 10), num = 2E3 > num ? 2E3 : num);
            if (num) {
                var b = this;
                setTimeout(function () {
                    b.topWin.adminObj.mainPage.tabFocus(b.getTabNumber())
                }, num)
            } else this.topWin.adminObj.mainPage.tabFocus(this.getTabNumber())
        };
        this.tabFitShow = function () {
            this.topWin.zeroAdminUI.mainPage.tabFitShow(this.getTabNumber())
        };
        this.tabLock = function (isLock) {
            this.topWin.zeroAdminUI.mainPage.tabLock(this.getTabNumber(), isLock)
        };
        this.tabClose = function () {
            this.topWin.zeroAdminUI.mainPage.tabClose(this.getTabNumber())
        };
        this.getPageTabIframeNode = function () {
            if (!this.isTabIframePage) return null;
            if (this.tabIframeNode) return this.tabIframeNode;
            for (var a = $(this.topWin.document, "iframe"), b = null, e = 0; e < a.length; e++) if (a[e].contentWindow == window) {
                b = this.tabIframeNode = a[e];
                break
            }
            return b
        };
        this.getTabNumber = function () {
            if (this.tabNumber) return this.tabNumber;
            var a = this.getPageTabIframeNode(),
                b = "";
            a && (b = $(a).attribute("id"));
            return b ? this.tabNumber = b.replace(/^iframe/, "") : b
        };
        this.isMultiTabs = false;
        if (this.isTabIframePage) {
            var tabs = this.topWin.document.getElementById('zero_ap_layout_right_tabs');
            UI.isMultiTabs = !($(tabs, 'class>zero_tabs_single', 1).length > 0);
            $.ready(pageReadyFunc);
        }
    }();

    $.adminUI = window.zeroAdminUI = UI;

    $.ready(function () {
        if (!isTouchScreen) {
            zero(document.createElement('div')).cssText('display:none;').html('&nbsp;<style>::-webkit-scrollbar{width:8px;height:8px;}::-webkit-scrollbar-button{background: #2c8ed3; height:8px;width:8px;}::-webkit-scrollbar-track-piece{background: #e7f9fb;}::-webkit-scrollbar-thumb {background:#ccc;border:solid 1px #e7f9fb;border-left:none;}#zero_ap_layout_left ::-webkit-scrollbar-button{height:0;}#zero_ap_layout_left ::-webkit-scrollbar-track-piece{background:#225588;width:0;}#zero_ap_layout_left ::-webkit-scrollbar-thumb{background-color:#2cc0f0;border:0;border-left:solid 0 #000;}</style>').appendTo();
        }
    });
})(zero);