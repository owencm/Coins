# Coins API Polyfill

This is a prototype polyfill for the Coins API. It adds navigator.coinManager. It has the following methods: getCoinCount, getCoinDepreciationRate and requestExtraCoins. 

It also replaces the alert function with a version tariffed by coins. You could easily modify the polyfill to apply the tariffs to any function you like (e.g. push messaging when it becomes available).

Coins are awarded each visit (inversely proportionally to how recently you last visited) and depreciate over time. Note this polyfill asumes it is run in a page context, not in a service worker. To use it in a service worker you'd need to modify it so visitCoins are only awarded when the user actually visits the page to avoid it considering each service worker wake up as a visit.

I have also added the function pretendLastVisitWasNDaysAgo so you can see the simulated effect of revisiting this page many days later.

Note: this also adds localstorage.coinCountPrivate and localstorage.lastVisited which are unfortunate visible implementation details and wouldn't be visible in a real implementation.
