(function() {
  "use strict";

  var DataBinding = Backbone.Model.extend();
  var data = new DataBinding();

  var handleInputValue = function(input) {
    var id = input.attr('id');
    var value = input.val();
    data.set(id, value);
  };

  var initializeData = function(index, element) {
    var input = $(element);
    handleInputValue(input);
  };

  var updateData = function(event) {
    var input = $(event.currentTarget);
    handleInputValue(input);
  };

  var calculateEquityValues = function() {
    var payCutPerYear = data.get('pay-cut-per-year');
    var jobTenure = data.get('job-tenure');
    var sharesOutstanding = data.get('shares-outstanding');
    var yourShares = data.get('your-shares');
    var strikePrice = data.get('strike-price');
    var funding = data.get('funding');
    var investorMultipler = data.get('investor-multiplier');
    var valuation = data.get('valuation');

    var salaryLost = payCutPerYear * jobTenure;
    var exercisePrice = yourShares * strikePrice;
    var ownershipPercentage = yourShares / sharesOutstanding;
    var investorTake = investorMultipler * funding;
    var stockAfterInvestors = valuation - investorTake;
    var stockValue = stockAfterInvestors * ownershipPercentage;

    var yourInvestment = salaryLost + exercisePrice;
    var roi = stockValue / yourInvestment;

    data.set('salary-lost', salaryLost);
    data.set('exercise-price', exercisePrice);
    data.set('ownership-percentage', ownershipPercentage);
    data.set('investor-take', investorTake);
    data.set('stock-after-investors', stockAfterInvestors);
    data.set('stock-value', stockValue);
    data.set('your-investment', yourInvestment);
    data.set('roi', roi);

    console.log(data.attributes);
  };

  var updateBoundUIElements = function() {
    console.log('updateBoundUIElements method');
    $('.bound-field').each(function(index, element) {
      var el = $(element);
      var id = el.attr('data-source');
      var value = data.get(id);
      if (el.is('input')) {
        el.val(value);
      } else {
        el.text(value);
      }
    });
  };

  data.on('change', calculateEquityValues);
  data.on('change', updateBoundUIElements);
  $('input').each(initializeData);
  $('input').on('input keyup change', updateData);
})();