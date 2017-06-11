(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'narrowItDown',
      bindToController: true
    };

    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrowItDown = this;

    narrowItDown.searchTerm = "";

    narrowItDown.search = function () {
      var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm);
      console.log(narrowItDown.searchTerm, 'searchTerm');
      promise.then(function (results) {
        narrowItDown.found = results.foundItems;
        narrowItDown.searchTerm = results.searchTerm;
        console.log(narrowItDown.found, 'controller getMatchedMenuItems');
      })
    };

    narrowItDown.removeItem = function (index) {
      narrowItDown.found.splice(index, 1);
    }
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })
      .then(function (result) {
        console.log(result.data.menu_items, 'result from search');
        //array of objects and you want to search for name
        var foundItems = [];
        var returnedItems = result.data.menu_items;
        console.log(searchTerm);
        if (searchTerm) {
          for (var i = 0; i < returnedItems.length; i++) {
            if (returnedItems[i].name.toLowerCase().includes(searchTerm.toLowerCase())) {
              foundItems.push(returnedItems[i]);
              i++;
            }
          }
          console.log(foundItems, 'foundItems');
          return {foundItems: foundItems, searchTerm: searchTerm};
        } else {
          return {foundItems: [], searchTerm: searchTerm};
        }
      });
    }
  }

})();
