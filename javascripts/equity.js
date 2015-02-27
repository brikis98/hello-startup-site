(function() {
  "use strict";

  var DataBinding = Backbone.Model.extend();
  var data = new DataBinding();

  var INVALID_VALUE_CLASS = "invalid-value";
  var handleInputValue = function(input) {
    var id = input.attr('id');
    var value = input.val();
    var min = +input.attr('min');
    var max = +input.attr('max');

    if (isNaN(value) || +value < min || +value > max) {
      $(input).addClass(INVALID_VALUE_CLASS);
    } else {
      $(input).removeClass(INVALID_VALUE_CLASS);
      data.set(id, value);
    }
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
    var investorTake = Math.min(investorMultipler * funding, valuation);
    var stockAfterInvestors = Math.max(valuation - investorTake, 0);
    var stockValue = stockAfterInvestors * ownershipPercentage;

    var yourInvestment = salaryLost + exercisePrice;
    var profitOrLoss = stockValue - yourInvestment;
    var roi = stockValue / yourInvestment;

    data.set('salary-lost', salaryLost);
    data.set('exercise-price', exercisePrice);
    data.set('ownership-percentage', ownershipPercentage);
    data.set('investor-take', investorTake);
    data.set('stock-after-investors', stockAfterInvestors);
    data.set('stock-value', stockValue);
    data.set('your-investment', yourInvestment);
    data.set('profit-or-loss', profitOrLoss);
    data.set('roi', roi);

    console.log(data.attributes);
  };

  var PROFIT_CLASS = "profit";
  var LOSS_CLASS = "loss";

  var updateBoundUIElements = function() {
    $('.bound-field').each(function(index, element) {
      var el = $(element);
      var id = el.attr('data-source');
      var format = el.attr('data-format');
      var value = data.get(id);
      var numericValue = +value;

      var formattedValue = format ? numeral(numericValue).format(format) : value;

      if (el.is('input')) {
        el.val(formattedValue);
      } else {
        el.text(formattedValue);
      }

      if (el.hasClass('profit-loss')) {
        if (numericValue === 0) {
          el.removeClass(PROFIT_CLASS);
          el.removeClass(LOSS_CLASS);
        } else if (numericValue > 0) {
          el.removeClass(LOSS_CLASS);
          el.addClass(PROFIT_CLASS);
        } else if (numericValue < 0) {
          el.removeClass(PROFIT_CLASS);
          el.addClass(LOSS_CLASS);
        }
      }
    });
  };

  $('.equity-form input').each(initializeData);
  data.on('change', calculateEquityValues);
  data.on('change', updateBoundUIElements);
  $('.equity-form input').on('input keyup change', updateData);
  data.trigger('change');
})();