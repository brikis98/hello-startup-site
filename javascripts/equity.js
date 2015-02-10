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
    var percentOwnership = yourShares / sharesOutstanding;
    var investorTake = investorMultipler * funding;
    var stockValue = (valuation - investorTake) * percentOwnership;

    var totalInvestment = salaryLost + exercisePrice;
    var roi = stockValue / totalInvestment;

    data.set('salary-lost', salaryLost);
    data.set('exercise-price', exercisePrice);
    data.set('percent-ownership', percentOwnership);
    data.set('investor-take', investorTake);
    data.set('stock-value', stockValue);
    data.set('total-investment', totalInvestment);
    data.set('roi', roi);

    console.log(data.attributes);
  };

  var updateBoundUIElements = function() {
    console.log('updateBoundUIElements method');
    $('.bound-field').each(function(index, element) {
      console.log('updateBoundUIElements loop for ' + element);
      var input = $(element);
      var id = input.attr('data-source');
      var value = data.get(id);
      input.text(value);
    });
  };

  data.on('change', calculateEquityValues);
  data.on('change', updateBoundUIElements);
  $('input').each(initializeData);
  $('input').on('input keyup change', updateData);
})();