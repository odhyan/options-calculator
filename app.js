var optionsApp = angular.module("optionsApp", ['ui.bootstrap']);

optionsApp.controller('MainCtrl', function($scope) {
	$scope.tradeTypes = [
		{name: "Buy", code: 'b'},
		{name: "Sell", code: 's'}
	];
	$scope.optionTypes = [
		{name: "Call", code: 'ce'},
		{name: "Put", code: 'pe'}
	];
	$scope.trades = [];

	$scope.addTrade = function() {
		$scope.trades.push({
			tradeType: $scope.tradeTypes[0],
			optionType: $scope.optionTypes[0],
			strike: 0,
			premium: 0,
			qty: 1
		});
	};

	$scope.netPremium = function() {
		var ret = 0;
		$scope.trades.forEach(function(trade) {
			if(trade.tradeType.code == "b") {
				ret -= trade.premium * trade.qty;
			} else {
				ret += trade.premium * trade.qty;
			}
		});
		return ret;
	};

});