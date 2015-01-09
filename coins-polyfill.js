// Copyright (C) 2013:
//    Owen Campbell-Moore <owencm@chromium.org>
//
// Use of this source code is governed by
//    http://www.apache.org/licenses/LICENSE-2.0
//
// This adds navigator.coinManager, the interface to the coins API. It also replaces 
// the alert function with one tariffed by coins. Coins are awarded each visit and 
// depreciate over time.
//
// Note: this also adds localstorage.coinCountPrivate and localstorage.lastVisited 
// which wouldn't be visible in a real implementation

// TODO(owencm): Promisify me and tidy up
(function() {
	// Every day we set coins to round(coins*coinDeprecationRate)
	var coinDepreciationRate = 0.9;

	// The public API implementation
	var CoinManager = function() {
		var getCoinCount = function () {
			return parseInt(localStorage.coinCountPrivate);
		};
		var getCoinDepreciationRate = function () {
			return coinDepreciationRate;
		};
		var requestExtraCoins = function () {
			if (confirm('This site wants additional coinz. Is that OK?')) {
				localStorage.coinCountPrivate = parseInt(localStorage.coinCountPrivate) + 30;
				console.log('You now have ' + localStorage.coinCountPrivate + ' coins due to your request');
				return true;
			} else {
				console.log('Your request for more coins was denied.');
				return false;
			}
		}
		return {getCoinCount: getCoinCount, getCoinDepreciationRate: getCoinDepreciationRate, requestExtraCoins: requestExtraCoins};
	};

	// The private API implementation which needs to be in scope when making a call tariffed
	var CoinManagerPrivate = function(){
		// Set up localstorage, depreciate and award coins since last visit
		var init = function () {
			if (!localStorage.coinCountPrivate) {
				localStorage.coinCountPrivate = 0;
			}
			// If you've never visited before, set the visit as 1970
			if (!localStorage.lastVisited) {
				localStorage.lastVisited = 0;
			}
			var now = (new Date).getTime();
			var daysSinceLastVisit = Math.round((now - localStorage.lastVisited)/(1000*60*60*24));
			console.log(daysSinceLastVisit + ' days since you last visited.');
			console.log('You have ' + localStorage.coinCountPrivate + ' coins');

			// Depreciate the sites coins. If you've never visited before this has no effect.
			depreciateCoins(daysSinceLastVisit, coinDepreciationRate)
			
			// Award coins due to this visit
			localStorage.coinCountPrivate = parseInt(localStorage.coinCountPrivate) + calulateVisitCoins(daysSinceLastVisit);
			console.log('You now have ' + localStorage.coinCountPrivate + ' coins due to visiting the site');
			// Set last visited time to now
			localStorage.lastVisited = (new Date).getTime();
		};
		// Depreciates coins proportionally to the amount of time since you last visited the site
		var depreciateCoins = function (numDays, depreciationRate) {
			// Do with a for loop so rounding is applied within each loop, not afterwards if you were to use a power
			for (var i = 0; i < numDays; i++) {
				localStorage.coinCountPrivate = Math.round(localStorage.coinCountPrivate*depreciationRate);
			}
			console.log('You now have ' + localStorage.coinCountPrivate + ' coins due to depreciation');
		}
		var calulateVisitCoins = function (numDays) {
			// The number of coins you receive is inversely proportional to when you last visited the site, but you only get them on the first visit in a day
			// If this is your first visit today you get coinz
			// TODO(owencm): change this to first visit in 12 hours
			var visitCoins = 0;
			if (numDays > 0) {
				// Add a Math.max to prevent this going negative if numDays > 31
				visitCoins = Math.max(0, Math.round(0.5+(30-numDays)/2));
			}
			return visitCoins;
		}
		var spendCoins = function (numCoins) {
			if (parseInt(localStorage.coinCountPrivate) < numCoins) {
				throw new Error('Not Enough Coins');
			}
			localStorage.coinCountPrivate = parseInt(localStorage.coinCountPrivate) - numCoins;
			console.log('You spent ' + numCoins + ' coins and now have ' + localStorage.coinCountPrivate);
		};
		var grantCoins = function (numCoins) {
			localStorage.coinCountPrivate = parseInt(localStorage.coinCountPrivate) + numCoins;
			console.log('You gained ' + numCoins + ' coins and now have ' + localStorage.coinCountPrivate);
		}
		init();
		return {spendCoins: spendCoins, grantCoins: grantCoins};
	};

	var coinManager = CoinManager();
	var coinManagerPrivate = CoinManagerPrivate();
	navigator.coinManager = coinManager; // Add the interface to the window

	// Replace the standard alert function with a tarriffed function
	var oldAlert = alert;
	alert = function (str) {
		// This will throw an error if you don't have enough coins.
		coinManagerPrivate.spendCoins(1);
		oldAlert.apply(this, arguments);
	}
})();
