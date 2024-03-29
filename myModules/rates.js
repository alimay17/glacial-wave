exports.calcRate = calcRate;

function calcRate(data){

  // lookup tables for calculating rate
  var stamped = {
    1: .55,
    2: .70,
    3: .85,
    3.5: 1.00
  } 
  var metered = {
    1: .50,
    2: .65,
    3: .80,
    3.5: .95
  } 

  var flats = {
    1: 1.00,
    2: 1.15,
    3: 1.30,
    4: 1.45,
    5: 1.60,
    6: 1.75,
    7: 1.90,
    8: 2.05,
    9: 2.20,
    10: 2.35,
    11: 2.50,
    12: 2.65,
    13: 2.80
  }

  var package = {
    1: 3.66,
    2: 3.66,
    3: 3.66,
    4: 3.66,
    5: 4.39,
    6: 4.39,
    7: 4.39,
    8: 4.39,
    9: 5.19,
    10: 5.19,
    11: 5.19,
    12: 5.19,
    13: 5.71
  }


  // switch to calculate the postage rate

  switch(data.type) {
    case '1':
      for (w in stamped) {
        if (w == data.weight){
          data.rate = stamped[w].toFixed(2);
          return data;
        }
      }
    case '2':
      for (w in metered) {
        if (w == data.weight){
          data.rate = metered[w].toFixed(2);
          return data;
        }
      }
    case '3':
      for (w in flats) {
        if (w == data.weight){
          data.rate = flats[w].toFixed(2);
          return data;
        }
      }
    case '4':
      for (w in package) {
        if (w == data.weight){
          data.rate = package[w].toFixed(2);
          return data;
        }
      }
    default:
      data.rate = 0;
      return data;
  }
}

