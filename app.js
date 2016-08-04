var app = angular.module("optionsApp", ['ui.bootstrap']);

app.controller('MainCtrl', function($scope, DataService) {
	$scope.setups = DataService.getAllSetups();

	function getSetupId() {
	  	function s4() {
	    	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  	}
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	$scope.addSetup = function() {
		var setup = {
			id: getSetupId(),
			name,
			spotPrice: 0,
			trades: []
		};
		$scope.setups.push(setup);
	};

	$scope.deleteSetup = function(setup) {
		for(var i = 0; i < $scope.setups.length; i++) {
			if($scope.setups[i].id == setup.id) {
				$scope.setups.splice(i, 1);
				DataService.saveSetups($scope.setups);
				break;
			}
		}
	};

	$scope.addTrade = function(setup) {
		setup.trades.push({
			tradeType: "buy",
			optionType: "call",
			strike: 0,
			premium: 0,
			qty: 1
		});
	};

	$scope.netPremium = function(setup) {
		var ret = 0;
		setup.trades.forEach(function(trade) {
			if(trade.tradeType == "buy") {
				ret -= trade.premium * trade.qty;
			} else { //sell
				ret += trade.premium * trade.qty;
			}
		});

		return ret;
	};

	$scope.netProfit = function(setup) {
		if(setup.spotPrice == 0) return 0;

		DataService.saveSetups($scope.setups);

		var ret = 0;
		setup.trades.forEach(function(trade) {
			if(trade.tradeType == "buy") {
				if(trade.optionType == "call") {
					ret += (Math.max(setup.spotPrice - trade.strike, 0) - trade.premium) * trade.qty;
				} else { //put
					ret += (Math.max(trade.strike - setup.spotPrice, 0) - trade.premium) * trade.qty;
				}
			} else { //sell
				if(trade.optionType == "call") {
					ret += (trade.premium - Math.max(setup.spotPrice - trade.strike, 0)) * trade.qty;
				} else { //put
					ret += (trade.premium - Math.max(trade.strike - setup.spotPrice, 0)) * trade.qty;
				}
			}
		});

		return parseFloat(ret).toFixed(2);
	};

});

app.factory('DataService', function(StorageService) {
	var methods = {
		getAllSetups: function() {
			var data = StorageService.getData() || [];
			return data;
		},
		saveSetups: function(data) {
			StorageService.saveData(data);
		}
	};
	return methods;
});

app.factory('StorageService', function() {
	var methods = {
		saveData: function(data) {
			if(typeof localStorage !== "undefined") {
				if(data.length) {
					localStorage.setItem('_data', JSON.stringify(data));
				}
			}
		},
		getData: function() {
			var ret = [];
			if(typeof localStorage !== "undefined") {
				var data = localStorage.getItem('_data');
				if(data) {
					ret = JSON.parse(data);
				}
			}
			return ret;
		}
	};
	return methods;
});