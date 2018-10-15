//#region Namespace

const ATM = {
  Utils: {}
};

//#endregion

//#region Utility Functions

(function({Utils : u}) {

  const $ = function(identifier) {
    return document.querySelectorAll(identifier)[0];
  };

  const isPositiveInteger = function (str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n > 0;
  }

  const getRemainderNQuotient = function(dividend, divisor) {
    const rem = dividend % divisor;
    return {
      quotient: (dividend - rem) / divisor,
      remainder: rem
    };
  };

  u.$ = $;
  u.isPositiveInteger = isPositiveInteger;
  u.getDivisionObj = getRemainderNQuotient;

})(ATM);

//#endregion

//#region Main Function

(function (a) {

  const u = a.Utils;
  const $ = u.$;

  const dom = {
    getMoney: "#getMoney",
    amount: "#amount",
    err: "#error",
    table: "#table"
  };

  const initHandlers = function () {
    $(dom.getMoney).addEventListener("click", _dispense);
    $(dom.amount).addEventListener("keyup", function(e){
      const key = e.which || e.keyCode;
      if(key === 13) {
        _dispense();
        this.blur();
      }
    });
  };

  const _dispense = function () {
    const amount = _getAmount();
    if (amount) {
      const processedObj = _processAmount(amount);
      const ui = _getUi(processedObj);
      $(dom.table).innerHTML = ui;
    }
  };

  const _getAmount = function() {
    const amt = $(dom.amount).value;
    if (!amt || !u.isPositiveInteger(amt)) {
      $(dom.err).innerHTML = "Please enter a valid amount";
      return;
    } else {
      $(dom.err).innerHTML = "";
      return amt;
    }
  };

  const _processAmount = function(amt) {
    // availableDenominations
    let ad = "1,2,5,10,20,50,100,200,500,2000".split(",");

    // Making an object to keep track of note count against each denomination
    const adTrack = ad.reduce((acc, cv) => {
      acc[cv] = 0;
      return acc;
    }, {});

    // Recursive function to add count value against each denomination
    function process(){
      if (ad.length > 0 && amt > 0) {
        const max = parseInt(ad.splice(ad.indexOf(Math.max(ad)), 1)[0]);
        if (amt !== 0 && amt >= max) {
          const obj = u.getDivisionObj(amt, max);
          adTrack[max] = obj.quotient;
          const rem = obj.remainder;
          if(rem > 0) {
            amt = rem;
            process();
          }
        } else {
          process();
        }
      }
    }

    process();
    return adTrack;
  };

  const _getUi = function(o) {
    let dom = "<caption>You will get following amount</caption>",
    totalNotes = 0;

    const data = Object.keys(o).reduce((ui, k, i) => {
      const idx = ++i,
        count = o[k],
        note = count < 2 ? "note" : "notes",
        cell = `<td>${count} ${note} of Rs ${k}</td>`,
        item = idx % 2 !== 0 ? `<tr>${cell}` : `${cell}</tr>`;

      totalNotes = totalNotes + count;
      ui = ui + item;
      
      return ui;
    }, ""),
    foot = `<tfoot><tr><td colspan="2">Total notes dispensed: ${totalNotes}</td></tr></tfoot>`;

    dom = dom + data + foot;
    return dom;
  };

  a.init = initHandlers;

})(ATM);

//#endregion

//#region Initiate page

window.onload = function () {
  ATM.init();
};

//#endregion