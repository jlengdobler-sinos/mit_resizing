
var format = {
    distance: function(distance) {
      distance = (distance / 1000).toFixed(2) + ' km';
      return distance;
    },
    speed: function(speed) {
      speed = (speed * 1.852).toFixed(2) + ' km/h';  //Einheit umrechnen von Knoten zu km///
      return speed;
    },
    course: function(course) {
      var string = (course == 0 ? 'Norden' : (course == 90) ? 'Osten' : (course == 180) ? 'Süden' : (course == 270) ? 'Westen' : ''  );   //TODO Was machen mit Werten, die dazwischen liegen? ab wann NW, NO, SO, SW
      return string;
    },
    bool: function(bool) {
      bool = (bool == true ? 'Ja' : 'Nein');
      return bool;
    }
};

// function formatDistances(distance) {
//   distance = (distance / 1000).toFixed(2) + ' km';
//   return distance;
// }
//
// function formatSpeed(speed) {
//   speed = (speed * 1.852).toFixed(2) + ' km/h';  //Einheit umrechnen von Knoten zu km///
//   return speed;
// }
//
// function formatCourse(course) {
//   var string = (course == 0 ? 'Norden' : (course == 90) ? 'Osten' : (course == 180) ? 'Süden' : (course == 270) ? 'Westen' : ''  );   //TODO Was machen mit Werten, die dazwischen liegen? ab wann NW, NO, SO, SW
//   return string;
// }
//
// function formatBool(bool) {
//   bool = (bool == true ? 'Ja' : 'Nein');
//   return bool;
// }
