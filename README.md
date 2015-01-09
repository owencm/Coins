# Coins API Polyfill

This adds navigator.coinManager, the interface to the coins API with methods getCoinCount, getCoinDepreciationRate and requestExtraCoins. 

It also replaces the alert function with one tariffed by coins. You could use this to apply the tariffs to any function you like.

Coins are awarded each visit (inversely proportionally to how recently you last visited) and depreciate over time.

I have also added the function pretendLastVisitWasNDaysAgo so you can see the simulated effect of revisiting this page many days later.

Note: this also adds localstorage.coinCountPrivate and localstorage.lastVisited which are unfortunate visible implementation details and wouldn't be visible in a real implementation.
