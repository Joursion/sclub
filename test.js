var event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn);
  },
  trigger: function () {
    var key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key];

    if (! fns || fns.length === 0) {
      return false;
    }
    for(var i = 0, fn; fn = fns[i ++]; ) {
      fn.apply(this, arguments);
    }
  }
};

var installEvent = function (obj) {
  for(var i in event) {
    obj[i] = event[i];
  }
};

var salesOffices = [];
installEvent(salesOffices);

salesOffices.listen('squareMeter88', function (price) {
  console.log('jiage' + price);
});

salesOffices.listen('squareMeter88', function (price) {
    console.log('st' + price);
});


salesOffices.listen('squareMeter110', function (price) {
  console.log('jiage' + price);
});

salesOffices.trigger('squareMeter88', 200000);
salesOffices.trigger('squareMeter110', 3999999);

console.log('ds');
console.log(event.clientList['squareMeter88']);
console.log(event);


