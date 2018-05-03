var rest = {
  get_groups: function() {
    var result = "";
    $.ajax({
      type: 'GET',
      url: 'http://demo5.traccar.org/api/groups',
      async: true,
      headers: {
          "Authorization": "Basic " + btoa( sessionStorage.getItem("Username")+":"+sessionStorage.getItem("Password") )
      },
      success: function (groups) {
        result = groups;
      }
    });
    // console.log(result);
    return result;
  },
  get_devices: function(id) {
    var url_parameters = "";
    if(id != "" && id != "Alle" && id !== undefined) {  url_parameters = "?id="+id; }

    var result = "";
    $.ajax({
      type: 'GET',
      url: 'http://demo5.traccar.org/api/devices'+url_parameters,
      async: true,   //TODO deprecated
      headers: {
          // "Authorization": "Basic " + btoa("skipto@t-online.de:test")
          "Authorization": "Basic " + btoa( sessionStorage.getItem("Username")+":"+sessionStorage.getItem("Password") )
      },
      success: function (devices) {
        result = devices;
      }
    });
    return result;
  },
  get_positions: function(deviceId, start_date, end_date, id) {
    var result = "";
    var url_parameters = "";
    if(id != "" && id!== undefined) { url_parameters = "&id="+id; }

    $.ajax({
      type: 'GET',
      url: 'http://demo5.traccar.org/api/positions?deviceId='+deviceId+'&from='+start_date+'&to='+end_date+url_parameters,
      async: true,
      // positions?deviceId=12&from=2016-08-08T15:22:22.000Z&to=2016-08-08T15:52:22.000Z
      dataType: 'json', //muss angegeben werden, sonst erfolgt Rückgabe in CSV-Format
      headers: {
          // "Authorization": "Basic " + btoa("skipto@t-online.de:test")
          "Authorization": "Basic " + btoa( sessionStorage.getItem("Username")+":"+sessionStorage.getItem("Password") )
      },
      success: function (positions) {
        result = positions;
      }
    });
    return result;
  },
  get_geofences: function() {
    var result = "";
    $.ajax({
      type: 'GET',
      url: 'http://demo5.traccar.org/api/geofences',
      async: true,   //TODO deprecated
      headers: {
          // "Authorization": "Basic " + btoa("skipto@t-online.de:test")
          "Authorization": "Basic " + btoa( sessionStorage.getItem("Username")+":"+sessionStorage.getItem("Password") )
      },
      success: function (geofences) {
        result = geofences;
      }
    });
    return result;
  }

} //Ende rest-Objekt
