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

    UI.mainPage = function () {
        var rtabs, riframes;
        var winResize = function () {
            var h = $(win).getSize().height - $("header").getSize().height - $("footer").getSize().height;
            $("content").cssText("height:" + h + "px");
            var I = $("riframes");
            I.hasClass("zero_fitDiv") ? I.cssText("height:100%") : I.cssText("height:" + (h - 30) + "px")
        },
        topLayout = function () {
            var a = '<span class="zero_scrollbar" style="width:' + ($("separate")[0].offsetWidth - 2) + 'px;margin-left:1px;">&nbsp;</span><div class="zero_box"><div class="zero_vLine">&nbsp;</div></div>',
                l = $("separate").html(a).find("span", 1)[0],
                c = $("left_menu")[0],
                b = $("separate").find("div", 1)[0],
                e = $("left")[0],
                h = $("right")[0],
                k, g = function (a) {
                    a = a || window.event;
                    a = a.clientX / k * 100;
                    a = 0 > a ? 0 : 99 < a ? 99 : a;
                    e.style.width = a + "%";
                    h.style.width = 99 - a + "%"
                },
                q = function (a) {
                    a = a || window.event;
                    a = a.clientX / k * 100;
                    a = 0 > a ? 0 : a;
                    a = 99 < a ? 99 : a;
                    a = 0 > a ? 0 : 99 < a ? 99 : a;
                    e.style.width = a + "%";
                    h.style.width = 99 - a + "%";
                    b.releaseCapture ? (b.onmousemove = g, b.onmouseup = q, b.releaseCapture()) : (document.removeEventListener("mousemove", g, !0), document.removeEventListener("mouseup", q, !0));
                    b.onmousemove = null;
                    b.onmouseup = null;
                    isIE || isFirefox || (a = $("drag_mask_div"), a.length && a.remove())
                };
            b.onmousedown = function (a) {
                isIE || isFirefox || $.htmlStrToDom('<div id="drag_mask_div" style="position:absolute;z-index:10000;width:100%;height:100%;overflow:hidden;background:#f00;filter:alpha(opacity=0);opacity:0;"></div>').prependTo();
                a = document;
                k = a.documentElement.clientWidth;
                b.setCapture ? (b.onmousemove = g, b.onmouseup = q, b.setCapture()) : (document.addEventListener("mousemove", g, !0), document.addEventListener("mouseup", q, !0))
            };
            l.onmouseenter = function () {
                var menuH = c.offsetHeight, menuBoxH = c.parentNode.offsetHeight, menuDif = menuH - menuBoxH;
                if (menuDif < 1) {
                    return;
                }
                var YNs = [],
                    RNs = [],
                    pSize = $(l.parentNode).getSize(),
                    pPoint = $(l.parentNode).getAbsPoint(),
                    cSize = $(l).getSize();
                var drag = $.drag(l).begin(function (node, point, para) {
                    this.range(pPoint.x, pPoint.y, pSize.width, pSize.height - cSize.height);
                    $(node).addClass("zero_selected");
                    isIE || isFirefox || $.htmlStrToDom('<div id="drag_mask_div2" style="position:absolute;z-index:10000;width:100%;height:100%;overflow:hidden;background:#f00;filter:alpha(opacity=0);opacity:0;"></div>').prependTo();
                }).move(function (node, point, para) {
                    var cY = point.y - pPoint.y;
                    if (YNs[YNs.length - 1] === cY) {
                        return;
                    }
                    YNs.push(cY);
                    $(node).cssText('margin-top:' + cY + 'px');
                    var v = Math.floor(cY / (pSize.height - cSize.height) * 100);
                    if (RNs[RNs.length - 1] === v) {
                        return;
                    }
                    RNs.push(v);
                    if (v > 0) {
                        v = Math.floor((menuDif * v / 100));
                    }
                    $(c).cssText('margin-top:' + (v ? '-' + v : 0) + 'px');

                }).end(function (node, point, para) {
                    drag.release();
                    $(node).removeClass("zero_selected");
                    isIE || isFirefox || (f = $("drag_mask_div2"), f.length && f.remove());
                    YNs = [];
                    RNs = [];
                });
            };
            $(win).addEvent("resize", function () {
                l.style.width = l.parentNode.offsetWidth - 2 + "px"
            });
            var mousewheel = function (a) {
                var d = c.style.marginTop,
                    d = d ? parseInt(d, 10) : 0,
                    b = 0 - c.offsetHeight + c.parentNode.offsetHeight;
                0 < b && (b = 0);
                var f = l.parentNode.offsetHeight - l.offsetHeight;
                0 > f && (f = 0);
                var e = 0;
                a = a || window.event;
                a.wheelDelta ? e = 0 > a.wheelDelta ? -1 : 1 : a.detail && (e = 0 > a.detail ? 1 : -1);
                0 < e ? (d += 20, 0 < d && (d = 0)) : (d -= 20, d < b && (d = b));
                a = parseInt((~d + 1) / (~b + 1) * f, 10);
                l.style.marginTop = a + "px";
                c.style.marginTop = d + "px"
            };
            $("left_menu").addEvent("mouseenter", function () {
                if (isFirefox) {
                    document.addEventListener('DOMMouseScroll', mousewheel, false);
                    return;
                }
                window.onmousewheel = window.document.onmousewheel = mousewheel;
            }).addEvent("mouseleave", function () {
                if (isFirefox) {
                    document.removeEventListener('DOMMouseScroll', mousewheel, false);
                    return;
                }
                window.onmousewheel = window.document.onmousewheel = null;
            })
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
            var a = $("left_menu")[0];
            $(a, "a").foreach(function (a) {
                $(this.parentNode).attribute("link", $(this).attribute("href")).html($(this).html()).attribute("id", "nav" + $.guid())
            });
            $(a).addEvent("click", function (a) {
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
                        a.hasClass("zero_selected") ? (a = $(this).attribute("id").replace("nav", ""), tabSelected($("tab" + a))) : (a.addClass("zero_selected"), d.hasClass("zero_selected") || d.addClass("zero_selected"), menuOpen(this))
                    };
                    switch (a.nodeName.toLowerCase()) {
                        case "dt":
                            d.apply(a, []);
                            break;
                        case "dd":
                            c.apply(a, [])
                    }
                }
            })
        },
        menuSelected = function () {
            var a = $('left_menu').find("dd");
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
                 src = $(menu).attribute("link");
            tabCreate(title, src, num);
            tabSelected($(rtabs).find("class>zero_tab", 1).foreach(function (n) {
                $(this).attribute("n", n)
            }).last()[0])
        },
        tabsInit = function () {
            var d = $("rtabs").html('<div class="zero_r_arrow_l"><span class="zero_arrow_l">&lt;</span></div><div class="zero_r_tabs_init"><div class="zero_init"><div class="zero_tabs"></div></div></div><div class="zero_r_arrow_r"><span class="zero_arrow_r">&gt;</span></div>'),
            a = rtabs = $(d).find("class=zero_tabs"),
            b = riframes = $("riframes")
            e = $(d).find("class=zero_arrow_l"),
            c = $(d).find("class=zero_arrow_r");
            d.addEvent("click", function (d) {
                d = d || event;
                d = d.srcElement || d.target;
                if (d.className) switch (d.className.toLowerCase()) {
                    case "zero_arrow_l":
                        $(a).find("class>zero_tab", 1);
                        d = parseInt($(a)[0].style.marginLeft, 10);
                        cl = (d ? d : 0) + 121;
                        0 < cl && (cl = 0);
                        $(a).cssText("margin-left:" + cl + "px");
                        break;
                    case "zero_arrow_r":
                        var c = $(a).find("class>zero_tab", 1);
                        d = (d = parseInt($(a)[0].style.marginLeft, 10)) ? d : 0;
                        var b = $($(a)[0].parentNode).getSize().width,
                            c = 121 * c.length;
                        c > b && (b = c - b + d, 0 < b && (d -= 121 < b ? 121 : b, $(a).cssText("margin-left:" + d + "px")));
                        break;
                    case "zero_tab_text":
                        tabSelected(d.parentNode);
                        break;
                    case "zero_tab_close":
                        tabClose(d.parentNode)
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
            var f = /.*#(\w+)$/.exec(src),
                e = RegExp.$1.toString();
            f && (src = src.replace(/^(.*)#(\w+)$/, "$1"));
            var h = function () {
                iframe[0].style.visibility = "visible";
                var a = iframe[0];
                try {
                    var d = a.contentWindow;
                    d.document.body.style.backgroundColor = 'transparent';
                    $(d).addEvent("scroll", function () {
                        var a = d.document.documentElement.scrollTop || d.document.body.scrollTop,
                            b = d.document.documentElement.scrollLeft || d.document.body.scrollLeft;
                        if (c) {
                            var f = $("tab" + c);
                            f.length && f.attribute("sl", b ? b : 0).attribute("st", a ? a : 0)
                        }
                    }).addEvent("unload", function () {
                        a.style.visibility = "hidden";
                        $(d).removeEvent("scroll")
                    });
                    if (f) {
                        var b = $(d.document, "a").filter("name=" + e);
                        if (b.length) {
                            var h = $.getAbsPoint(b[0]);
                            d.scrollTo(0, h.y)
                        }
                    }
                } catch (k) { }
            };
            var iframe = $.htmlStrToDom('<iframe frameBorder="0" style="visibility:hidden;" allowTransparency="true" src="' + src + '" id="iframe' + num + '"></iframe>');
            $(riframes).find("iframe").removeClass("zero_selected");
            iframe[0].attachEvent ? iframe[0].attachEvent("onload", h) : iframe[0].onload = h;
            iframe.appendTo(riframes[0]);
            $(rtabs).cssText('width:'+($(rtabs,'div',1).length*121)+'px')
        },
        tabSelected = function (tab) {
            var c = $(tab).attribute("id").replace("tab", ""),
                f = parseInt($(tab).attribute("n"), 10);
            $(rtabs).find("class>zero_tab", 1).removeClass("zero_selected").filter("n=" + f).addClass("zero_selected");
            var e = $(rtabs)[0].style.marginLeft,
                e = parseInt(e ? e : 0, 10),
                f = 1 > f ? 0 : 121 * f,
                h = $(rtabs).parent().getSize().width - 121,
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

            } else $(riframes).find("iframe").removeClass("zero_selected"), $("iframe" + c).addClass("zero_selected");
            e = $(rtabs).attribute("sl");
            f = $(rtabs).attribute("st");
            e = e ? parseInt(e, 10) : 0;
            f = f ? parseInt(f, 10) : 0;
            try {
                $("iframe" + c)[0].contentWindow.scrollTo(e, f)
            } catch (m) { }
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
                parseInt($(rtabs)[0].style.marginLeft, 10) < (1 > b ? 0 : 0 - 121 * b) && tabSelected(e[b])
            }
            h.remove();
        },
        tabFocus = function (tab) {
            var c = $(tab).attribute("id").replace("tab", ""),
                f = parseInt($(tab).attribute("n"), 10);
            $(a).find("class>zero_tab", 1).removeClass("zero_selected").filter("n=" + f).addClass("zero_selected");
            var e = $(a)[0].style.marginLeft,
                e = parseInt(e ? e : 0, 10),
                f = 1 > f ? 0 : 121 * f,
                h = $(a).parent().getSize().width - 121,
                g = e + f;
            if (g > h || 0 > g) {
                var k = $.htmlStrToDom('<div style="width:100%;height:100%;overflow:hidden;position:absolute;z-index:9999;background:#fff;filter:alpha(opacity=10);opacity:0.01;left:0;top:0;"></div>').appendTo();
                var p = $(a).parent().getAbsPoint();
                var v = g > h ? 0 - f + h : 0 - f;
                $(a).changePosition({
                    to: { x: p.x + v, y: p.y },
                    isFast: true,
                    change: function (point, rate, step, distance) {
                        $(a).cssText("margin-left:" + (point.x - p.x) + "px");
                    },
                    end: function () {
                        $(b).find("iframe").removeClass("zero_selected");
                        $("iframe" + c).addClass("zero_selected");
                        k.remove();
                    }
                });

            } else $(b).find("iframe").removeClass("zero_selected"), $("iframe" + c).addClass("zero_selected");
            e = $(d).attribute("sl");
            f = $(d).attribute("st");
            e = e ? parseInt(e, 10) : 0;
            f = f ? parseInt(f, 10) : 0;
            try {
                $("iframe" + c)[0].contentWindow.scrollTo(e, f)
            } catch (m) { }
        },
        tabFitShow = function (tab) {
             var id = '_' + $.guid(), c = $(id);
             if (c.length) { c.find("class=zero_back").fireEvent("click"); }
             else {
                 var b = $("iframe" + $(tab).attribute("id").replace("tab", "")),
                     f = $.htmlStrToDom('<div class="zero_btn_init" id="' + id + '"><div class="zero_init"><a class="zero_back">退出全屏</a></div></div>').insertAfter(b[0]);
                 $(b[0].parentNode).addClass("zero_fitDiv").cssText("height:100%;");
                 if (isIE || isFirefox || isEdge) { $("right").cssText("position:static;"); }
                 var e = document.title;
                 iframeTitle = $(tab).find("class=zero_tab_text").html();
                 try {
                     var h = b[0].contentWindow.document.title;
                     h && (iframeTitle = h)
                 } catch (g) { }
                 document.title = iframeTitle;
                 fsc(true);
                 $(f).find("class=zero_back").addEvent("click", function () {
                     if (isIE || isFirefox || isEdge) { $("right").cssText("position:relative"); }
                     document.title = e;
                     var a = $(window).getSize().height - $("header").getSize().height - $("footer").getSize().height - 30;
                     $(this).removeEvent("click");
                     $(b[0].parentNode).removeClass("zero_fitDiv").cssText("height:" + a + "px;");
                     f.remove();
                     fsc(false);
                 })
             }
         };

        return new function () {
            this.isTopWin = isTopWin;
            this.init = function () {
                if (!$(document.body).hasClass("zero_top_page")) { return; }

                $(win).addEvent("resize", winResize);
                $("header").addEvent("click", function (a) {
                    a = a || event;
                    a = a.srcElement || a.target;
                    $(a).hasClass("zero_up") ? ($(this).addClass("zero_header_hide"), $(win).fireEvent("resize")) : $(a).hasClass("zero_down") && ($(this).removeClass("zero_header_hide"), $(window).fireEvent("resize"))
                });
                winResize();
                topLayout();
                menuInit();
                tabsInit();
                menuSelected();
                //对IE567强制触发渲染重绘
                if (isIE567) {
                    $(e)[0].offsetHeight;
                    $(c)[0].offsetHeight;
                    $("header", "class=zero_arrow_init")[0].offsetHeight;
                }
                if(isIE || isEdge || isFirefox){
                    $("right").cssText("position:relative");
                }
            };
            this.tabClose = function (num) {
                num && (num = $("tab" + num), num.length && tabClose(num[0]));
            };
            this.tabFocus = function (num) {
                num && (num = $("tab" + num), num.length && tabFocus(num[0]));
            };
            this.tabFitShow = function (num) {
                num && (num = $("tab" + num), num.length && tabFitShow(num[0]))
            };
            this.tabLock = function (num, isLock) {
                if (num) {
                    var b = $("tab" + num);
                    b.length && (isLock ? b.attribute("locked", 1) : b.removeAttribute("locked"))
                }
            };
        }();
    }();

    UI.tabIframePage = new function () {
        var _this = this,
        tabIframePageCtrl = function () {
            $(document.body, 'select').filter('class>zero_iframe_page_ctrl').addEvent('change', function (e) {
                var s = this.options[this.selectedIndex].innerHTML;
                switch (this.value) {
                    case 'page_lock':
                        _this.pageTabLock(true);
                        break;
                    case 'page_unlock':
                        _this.pageTabLock(false);
                        break;
                    case 'page_refresh':
                        window.location.reload(true);
                        s = '';
                        break;
                    case 'page_print':
                        window.print();
                        break;
                    case 'page_full':
                        _this.pageTabFitShow();
                        break;
                    case 'page_source':
                        s = '';
                        var w = dialog.waiting('……请稍候……');
                        $.ajax(document.URL).error(function (e) { return e; }).send(function (res) {
                            w.close();
                            dialog.alert(document.URL + '-source', '<ol class="zero_code_highlight"><li>' + $.codeHighlight.html(res).replace(/(\r\n|\n)/g, '</li><li>') + '</li></ol>', null, 1024);
                        });
                        break;
                    case 'page_source_now':
                        s = '';
                        if (document.documentElement && document.documentElement.outerHTML) {
                            var w = dialog.waiting('……请稍候……');
                            setTimeout(function () {
                                w.close();
                                dialog.alert(document.URL + '-source', '<ol class="zero_code_highlight"><li>' + $.codeHighlight.html(document.documentElement.outerHTML).replace(/(\r\n|\n)/g, '</li><li>') + '</li></ol>', null, 1024);
                            }, 1000);

                        } else {
                            dialog.alert('操作提示', '浏览器不支持该操作');
                        }
                        break;
                }
                this.selectedIndex = 0;
            });
        },
        pageReadyFunc = function () {
            tabIframePageCtrl();
        };
        this.isTabIframePage = win !== topWin;
        this.topWin = topWin;
        this.pageTabIframeNode = this.tabNumber = null;
        this.pageTabFocus = function (num) {
            isNaN(num) ? num = 0 : (num = parseInt(num, 10), num = 2E3 > num ? 2E3 : num);
            if (num) {
                var b = this;
                setTimeout(function () {
                    b.topWin.adminObj.mainPage.tabFocus(b.getPageTabNumber())
                }, num)
            } else this.topWin.adminObj.mainPage.tabFocus(this.getPageTabNumber())
        };
        this.pageTabFitShow = function () {
            this.topWin.zeroAdminUI.mainPage.tabFitShow(this.getPageTabNumber())
        };
        this.pageTabLock = function (isLock) {
            this.topWin.zeroAdminUI.mainPage.tabLock(this.getPageTabNumber(), isLock)
        };
        this.pageTabClose = function () {
            this.topWin.zeroAdminUI.mainPage.tabClose(this.getPageTabNumber())
        };
        this.getPageTabIframeNode = function () {
            if (!this.isTabIframePage) return null;
            if (this.pageTabIframeNode) return this.pageTabIframeNode;
            for (var a = $(this.topWin.document, "iframe"), b = null, e = 0; e < a.length; e++) if (a[e].contentWindow == window) {
                b = this.pageTabIframeNode = a[e];
                break
            }
            return b
        };
        this.getPageTabNumber = function () {
            if (this.pageTabNumber) return this.pageTabNumber;
            var a = this.getPageTabIframeNode(),
                b = "";
            a && (b = $(a).attribute("id"));
            return b ? this.pageTabNumber = b.replace(/^iframe/, "") : b
        };
        if (this.isTabIframePage) {
            $.ready(pageReadyFunc);
        }
    }();

    $.adminUI = window.zeroAdminUI = UI;

    $.ready(function () {
        $.UI.zeroFormInputBoxWatcher();
    });
})(zero);