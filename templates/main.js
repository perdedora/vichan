{% verbatim %}

/* gettext-compatible _ function, example of usage:
 *
 * > // Loading pl_PL.json here (containing polish translation strings generated by tools/i18n_compile.php)
 * > alert(_("Hello!"));
 * Witaj!
 */
function _(s) {
	return (typeof l10n != 'undefined' && typeof l10n[s] != 'undefined') ? l10n[s] : s;
}

/* printf-like formatting function, example of usage:
 *
 * > alert(fmt("There are {0} birds on {1} trees", [3,4]));
 * There are 3 birds on 4 trees
 * > // Loading pl_PL.json here (containing polish translation strings generated by tools/locale_compile.php)
 * > alert(fmt(_("{0} users"), [3]));
 * 3 uzytkownikow
 */
function fmt(s, a) {
	return s.replace(/\{([0-9]+)\}/g, function(x) { return a[x[1]]; });
}

function until(timestamp) {
	let difference = timestamp - Date.now() / 1000 | 0;
	switch (true) {
	case (difference < 60):
		return "" + difference + ' ' + _('second(s)');
	case (difference < 3600): // 60 * 60 = 3600
		return "" + Math.round(difference / 60) + ' ' + _('minute(s)');
	case (difference < 86400): // 60 * 60 * 24 = 86400
		return "" + Math.round(difference / 3600) + ' ' + _('hour(s)');
	case (difference < 604800): // 60 * 60 * 24 * 7 = 604800
		return "" + Math.round(difference / 86400) + ' ' + _('day(s)');
	case (difference < 31536000): // 60 * 60 * 24 * 365 = 31536000
		return "" + Math.round(difference / 604800) + ' ' + _('week(s)');
	default:
		return "" + Math.round(difference / 31536000) + ' ' + _('year(s)');
	}
}

function ago(timestamp) {
	let difference = (Date.now() / 1000 | 0) - timestamp;
	switch (true) {
	case (difference < 60):
		return "" + difference + ' ' + _('second(s)');
	case (difference < 3600): /// 60 * 60 = 3600
		return "" + Math.round(difference/(60)) + ' ' + _('minute(s)');
	case (difference < 86400): // 60 * 60 * 24 = 86400
		return "" + Math.round(difference/(3600)) + ' ' + _('hour(s)');
	case (difference < 604800): // 60 * 60 * 24 * 7 = 604800
		return "" + Math.round(difference/(86400)) + ' ' + _('day(s)');
	case (difference < 31536000): // 60 * 60 * 24 * 365 = 31536000
		return "" + Math.round(difference/(604800)) + ' ' + _('week(s)');
	default:
		return "" + Math.round(difference/(31536000)) + ' ' + _('year(s)');
	}
}

var datelocale =
	{ days: [_('Sunday'), _('Monday'), _('Tuesday'), _('Wednesday'), _('Thursday'), _('Friday'), _('Saturday')]
	, shortDays: [_("Sun"), _("Mon"), _("Tue"), _("Wed"), _("Thu"), _("Fri"), _("Sat")]
	, months: [_('January'), _('February'), _('March'), _('April'), _('May'), _('June'), _('July'), _('August'), _('September'), _('October'), _('November'), _('December')]
	, shortMonths: [_('Jan'), _('Feb'), _('Mar'), _('Apr'), _('May'), _('Jun'), _('Jul'), _('Aug'), _('Sep'), _('Oct'), _('Nov'), _('Dec')]
	, AM: _('AM')
	, PM: _('PM')
	, am: _('am')
	, pm: _('pm')
	};


function alert(a, do_confirm, confirm_ok_action, confirm_cancel_action) {
	var handler, div, bg, closebtn, okbtn;
	let close = function() {
		handler.fadeOut(400, function() { handler.remove(); });
		return false;
	};

	handler = $("<div id='alert_handler'></div>").hide().appendTo('body');

	bg = $("<div id='alert_background'></div>").appendTo(handler);

	div = $("<div id='alert_div'></div>").appendTo(handler);
	closebtn = $("<a id='alert_close' href='javascript:void(0)'><i class='fa fa-times'></i></div>")
		.appendTo(div);

	$("<div id='alert_message'></div>").html(a).appendTo(div);

	okbtn = $("<button class='button alert_button'>"+_("OK")+"</button>").appendTo(div);

	if (do_confirm) {
		confirm_ok_action = (typeof confirm_ok_action !== "function") ? function(){} : confirm_ok_action;
		confirm_cancel_action = (typeof confirm_cancel_action !== "function") ? function(){} : confirm_cancel_action;
		okbtn.click(confirm_ok_action);
		$("<button class='button alert_button'>"+_("Cancel")+"</button>").click(confirm_cancel_action).click(close).appendTo(div);
		bg.click(confirm_cancel_action);
		okbtn.click(confirm_cancel_action);
		closebtn.click(confirm_cancel_action);
	}

	bg.click(close);
	okbtn.click(close);
	closebtn.click(close);

	handler.fadeIn(400);
}

var saved = {};


var selectedstyle = '{% endverbatim %}{{ config.default_stylesheet.0|addslashes }}{% verbatim %}';
var styles = {
	{% endverbatim %}
	{% for stylesheet in stylesheets %}{% verbatim %}'{% endverbatim %}{{ stylesheet.name|addslashes }}{% verbatim %}' : '{% endverbatim %}{{ stylesheet.uri|addslashes }}{% verbatim %}',
	{% endverbatim %}{% endfor %}{% verbatim %}
};

if (typeof board_name === 'undefined') {
	var board_name = false;
}

function changeStyle(styleName, link) {
	{% endverbatim %}
	{% if config.stylesheets_board %}{% verbatim %}
		if (board_name) {
			stylesheet_choices[board_name] = styleName;
			localStorage.board_stylesheets = JSON.stringify(stylesheet_choices);
		}
	{% endverbatim %}{% else %}
		localStorage.stylesheet = styleName;
	{% endif %}
	{% verbatim %}

	if (!document.getElementById('stylesheet')) {
		var s = document.createElement('link');
		s.rel = 'stylesheet';
		s.type = 'text/css';
		s.id = 'stylesheet';
		var x = document.getElementsByTagName('head')[0];
		x.appendChild(s);
	}

	document.getElementById('stylesheet').href = styles[styleName];
	selectedstyle = styleName;

	if (document.getElementsByClassName('styles').length != 0) {
		var styleLinks = document.getElementsByClassName('styles')[0].childNodes;
		for (var i = 0; i < styleLinks.length; i++) {
			styleLinks[i].className = '';
		}
	}

	if (link) {
		link.className = 'selected';
	}

	if (typeof $ != 'undefined') {
		$(window).trigger('stylesheet', styleName);
	}
}


{% endverbatim %}
{% if config.stylesheets_board %}
	{% verbatim %}

	if (!localStorage.board_stylesheets) {
		localStorage.board_stylesheets = '{}';
	}

	var stylesheet_choices = JSON.parse(localStorage.board_stylesheets);
	if (board_name && stylesheet_choices[board_name]) {
		for (var styleName in styles) {
			if (styleName == stylesheet_choices[board_name]) {
				changeStyle(styleName);
				break;
			}
		}
	}
	{% endverbatim%}
{% else %}
	{% verbatim %}
	if (localStorage.stylesheet) {
		for (var styleName in styles) {
			if (styleName == localStorage.stylesheet) {
				changeStyle(styleName);
				break;
			}
		}
	}
	{% endverbatim %}
{% endif %}
{% verbatim %}

function initStyleChooser() {
	var newElement = document.createElement('div');
	newElement.className = 'styles';

	for (styleName in styles) {
		var style = document.createElement('a');
		style.innerHTML = '[' + styleName + ']';
		style.onclick = function() {
			changeStyle(this.innerHTML.substring(1, this.innerHTML.length - 1), this);
		};
		if (styleName == selectedstyle) {
			style.className = 'selected';
		}
		style.href = 'javascript:void(0);';
		newElement.appendChild(style);
	}

	document.getElementsByTagName('body')[0].insertBefore(newElement, document.getElementsByTagName('body')[0].lastChild.nextSibling);
}

function getCookie(cookie_name) {
	let results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
	if (results) {
		return unescape(results[2]);
	} else {
		return null;
	}
}

function highlightReply(id, evt) {
    if (evt && evt.button === 1) {
        return true;
    }

    document.querySelectorAll('div.post').forEach(div => {
        div.classList.remove('highlighted');
    });

    if (id) {
        const post = document.getElementById(`reply_${id}`);
        if (post) {
            post.classList.add('highlighted');
            window.location.hash = id;
        }
    }
		
	return true;
}

function generatePassword() {
	let pass = '';
	let chars = '{% endverbatim %}{{ config.genpassword_chars }}{% verbatim %}';
	for (let i = 0; i < 8; i++) {
		let rnd = Math.floor(Math.random() * chars.length);
		pass += chars.substring(rnd, rnd + 1);
	}
	return pass;
}

function doPost(form) {
	if (form.elements['name']) {
		localStorage.name = form.elements['name'].value.replace(/( |^)## .+$/, '');
	}
	if (form.elements['password']) {
		localStorage.password = form.elements['password'].value;
	}
	if (form.elements['email'] && form.elements['email'].value != 'sage') {
		localStorage.email = form.elements['email'].value;
	}

	saved[document.location] = form.elements['body'].value;
	sessionStorage.body = JSON.stringify(saved);

	return form.elements['body'].value != "" || (form.elements['file'] && form.elements['file'].value != "") || (form.elements.file_url && form.elements['file_url'].value != "");
}

function citeReply(id, with_link) {
    var textarea = document.getElementById('body');

    if (!textarea) return false;

    var insertionText = '>>' + id + '\n';

    if (document.selection) {
        // IE
        textarea.focus();
        var sel = document.selection.createRange();
        sel.text = insertionText;
    } else if (textarea.selectionStart !== undefined) {
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + insertionText + textarea.value.substring(end);

        textarea.selectionStart = textarea.selectionEnd = start + insertionText.length;
    } else {
        textarea.value += insertionText;
    }

	if (typeof $ != 'undefined') {
		let select = document.getSelection().toString();
		if (select) {
			let body = $('#reply_' + id + ', #op_' + id).find('div.body');  // TODO: support for OPs
			let index = body.text().indexOf(select.replace('\n', ''));  // for some reason this only works like this
			if (index > -1) {
				textarea.value += '>' + select + '\n';
			}
		}

		$(window).trigger('cite', [id, with_link]);
		$(textarea).change();
	}
	return false;
}

function rememberStuff() {
	if (document.forms.post) {
		if (document.forms.post.password) {
			if (!localStorage.password) {
				localStorage.password = generatePassword();
			}
			document.forms.post.password.value = localStorage.password;
		}

		if (localStorage.name && document.forms.post.elements['name']) {
			document.forms.post.elements['name'].value = localStorage.name;
		}
		if (localStorage.email && document.forms.post.elements['email']) {
			document.forms.post.elements['email'].value = localStorage.email;
		}

		if (window.location.hash.indexOf('q') == 1) {
			citeReply(window.location.hash.substring(2), true);
		}

		if (sessionStorage.body) {
			let saved = JSON.parse(sessionStorage.body);
			if (getCookie('{% endverbatim %}{{ config.cookies.js }}{% verbatim %}')) {
				// Remove successful posts
				let successful = JSON.parse(getCookie('{% endverbatim %}{{ config.cookies.js }}{% verbatim %}'));
				for (let url in successful) {
					saved[url] = null;
				}
				sessionStorage.body = JSON.stringify(saved);

				document.cookie = '{% endverbatim %}{{ config.cookies.js }}{% verbatim %}={};expires=0;path=/;';
			}
			if (saved[document.location]) {
				document.forms.post.body.value = saved[document.location];
			}
		}

		if (localStorage.body) {
			document.forms.post.body.value = localStorage.body;
			localStorage.body = '';
		}
	}
}

var script_settings = function(script_name) {
	this.script_name = script_name;
	this.get = function(var_name, default_val) {
		if (typeof tb_settings == 'undefined' ||
			typeof tb_settings[this.script_name] == 'undefined' ||
			typeof tb_settings[this.script_name][var_name] == 'undefined') {
			return default_val;
		}
		return tb_settings[this.script_name][var_name];
	}
};

function init() {
	if (active_page !== 'page') {
		init_stylechooser();
	}

	{% endverbatim %}
	{% if config.allow_delete %}
	if (document.forms.postcontrols) {
		document.forms.postcontrols.password.value = localStorage.password;
	}
	{% endif %}
	{% verbatim %}

	if (window.location.hash.indexOf('q') != 1 && window.location.hash.substring(1))
		highlightReply(window.location.hash.substring(1));
}

var RecaptchaOptions = {
	theme : 'clean'
};

onready_callbacks = [];
function onReady(fnc) {
	onready_callbacks.push(fnc);
}

function ready() {
	for (let i = 0; i < onready_callbacks.length; i++) {
		onready_callbacks[i]();
	}
}

function addLinkListenersCite(selector, callback) {
    document.querySelector('body').addEventListener('click', (event) => {
        if (event.target.matches(selector)) {
            event.preventDefault();

            var cite = event.target.getAttribute('data-cite');

            if (callback(cite, event)) {
                window.location.href = event.target.href;
            }
        }
    });
}

function addFormListener() {
    var form = document.getElementById('post-form');

    if (form) {
        form.addEventListener('submit', (event) => {
            if (!dopost(form)) {
                event.preventDefault();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
	ready();
	rememberStuff();
	addLinkListenersCite('.highlight-link', highlightReply);
	addLinkListenersCite('.cite-link', citeReply);
	addFormListener();
});

{% endverbatim %}

var post_date = "{{ config.post_date }}";
var max_images = {{ config.max_images }};

onReady(init);

{% if config.google_analytics %}{% verbatim %}

var _gaq = _gaq || [];_gaq.push(['_setAccount', '{% endverbatim %}{{ config.google_analytics }}{% verbatim %}']);{% endverbatim %}{% if config.google_analytics_domain %}{% verbatim %}_gaq.push(['_setDomainName', '{% endverbatim %}{{ config.google_analytics_domain }}{% verbatim %}']){% endverbatim %}{% endif %}{% if not config.google_analytics_domain %}{% verbatim %}_gaq.push(['_setDomainName', 'none']){% endverbatim %}{% endif %}{% verbatim %};_gaq.push(['_trackPageview']);(function() {var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();{% endverbatim %}{% endif %}

{% if config.statcounter_project and config.statcounter_security %}
var sc = document.createElement('script');
sc.type = 'text/javascript';
sc.innerHTML = 'var sc_project={{ config.statcounter_project }};var sc_invisible=1;var sc_security="{{ config.statcounter_security }}";var scJsHost=(("https:" == document.location.protocol) ? "https://secure." : "http://www.");document.write("<sc"+"ript type=text/javascript src="+scJsHost+"statcounter.com/counter/counter.js></"+"script>");';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(sc, s);
{% endif %}
