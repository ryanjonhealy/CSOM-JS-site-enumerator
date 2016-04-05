var clientContext;
var siteUrl;
var siteName;
var result;

//
// this script is used to loop through each subsite and amend the webpart included in the DTN display form
// the webpart must include the doc number, issued at, title and file - type
//


$(document).ready(function ($) {

	//setup document with button and table for results
	$('.ms-rte-embedcode').append(

		'<p></p>' +
		'<div>This script is used to loop through each subsite and amend the webpart included in the DTN display form </div>' +
		'<div>The webpart must include the doc number, issued at, title and file - type</div>' +
		'<p></p>' +
		'<input type="button" id="go" width="1500"  value="Update Sites"></input>' +
		'<p></p>' +
		'<table id="results"><tbody>' +
		'<tr style="vertical-align: top;">' +
		'<td style="width: 50%;">' +
		'</td><td></td><td></td>' +
		'</tr>' +
		'</tbody></table>' +
		'<p></p>' +
		'<p></p>');
	ExecuteOrDelayUntilScriptLoaded(function () {
		SP.UI.Notify.addNotification("Loaded Script...", false);
	}, "SP.js");

	$('#go').click(function () {
		SP.UI.Notify.addNotification("Working...", false);
		//$siteUrl = $('#sitename').val();
		loadWebs();

		// getNavNodes();
	});
});

//calls site looper function
function loadWebs() {

	enumWebs(['Url'],
		function (sender, args) {
		//console.log(result);
		updater(result);
	},
		function (sender, args) {
		alert(args.get_message());
	});
}

// function to loop through each site and subsite and returns results array
function enumWebs(propertiesToRetrieve, success, error) {
	var ctx = SP.ClientContext.get_current();
	var rootWeb = ctx.get_site().get_rootWeb();
	result = [];
	var level = 0;
	ctx.load(rootWeb, propertiesToRetrieve);
	result.push(rootWeb);
	var colPropertiesToRetrieve = String.format('Include({0})', propertiesToRetrieve.join(','));
	var enumWebsInner = function (web, result, success, error) {
		level++;
		var ctx = web.get_context();
		var webs = web.get_webs();
		ctx.load(webs, colPropertiesToRetrieve);
		ctx.executeQueryAsync(
			function () {
			for (var i = 0; i < webs.get_count(); i++) {
				var web = webs.getItemAtIndex(i);
				result.push(web);
				enumWebsInner(web, result, success, error);
			}
			level--;
			if (level == 0 && success)
				success(result);
		},
			error);
	};
	enumWebsInner(rootWeb, result, success, error);
}

//uses results array to pass each site url (without http://exp...)
//to the webpart updater
function updater() {
	SP.UI.Notify.addNotification("Logging...", false);
	$.each(result, function (index) {
		siteUrl = this.get_url();
		$('#results tbody').append(
			'<tr><td><div>' + siteUrl + '</div></td>' +
			'<td><div>' + siteUrl.substring(33, 1000) + '</div></td><td>' + index + '</td>' +
			'</tr>');
			
		//console.log(siteUrl);
		//call code function

		}
	);
}
