
var map_obj = {

  // map:
  // last_index_position_array:

  create_ol_map: function() {
    var map = new ol.Map({
      target: 'map_container',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        // center: ol.proj.fromLonLat([11.85, 48.81]), /*Höhen- und Breitengrad für die Mitte der Karte (derzeitiger Standpunkt / letzter gespeicherter Standpunkt)*/
        // center: ol.proj.transform([80.6350, 7.2964], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12,
        maxZoom: 20
      })
    });

    var last_positions_of_devices = new Array();
    var devices = rest.get_devices();
    // console.log(devices);
    // console.log(devices[devices.length-1].id);
    // console.log( performance.now() );
    //TODO device rauskriegen, dessen letzter Punkt am kürzesten zurückliegt, und die Koordinaten dieses Punktes zentrieren
    for(var i=0; i<devices.length; i++){
       $.ajax({
         type: 'GET',
         url: 'http://demo5.traccar.org/api/positions?deviceId='+devices[i].id+'&from=2018-02-22T18:30:00Z&to='+date.get_current_date_in_format_iso8601(),
         dataType: 'json', //muss angegeben werden, sonst erfolgt Rückgabe in CSV-Format
         headers: {
             "Authorization": "Basic " + btoa("skipto@t-online.de:test")
         },
         success: function (status) {
           if(status.length === 0) {
             return;
           }

           // last_positions_of_devices[i] = new ol.Overlay({
           //   // position: ol.proj.fromLonLat([11.85, 48.81]),//position,
           //   position: ol.proj.fromLonLat([status[status.length-1].longitude, status[status.length-1].latitude]),//position,
           //   positioning: 'center-center',
           //   element: document.getElementById('last_position'),
           //   stopEvent: false
           // });
           // map.addOverlay(last_positions_of_devices[i]);

           map_obj.CenterMap(map, status[status.length-1].longitude, status[status.length-1].latitude);
         }
       });
    }
    // console.log( performance.now() );
    return map;
  },

  CenterMap: function(map, lon, lat) {
    map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
  },

  remove_all_overlays: function(map) {
    map.getOverlays().getArray().slice(0).forEach(function(overlay) {
      map.removeOverlay(overlay);
    });
  },

  remove_all_layers_except_first_layer: function(map) {
    var layerArray, len, layer;
    layerArray = map.getLayers().getArray(),
    len = layerArray.length;
    while (len > 1){
        layer = layerArray[len-1];
        map.removeLayer(layer);
        len = layerArray.length;
    }
  },

  get_cords_from_bericht_table_to_center_map: function(rowId, map) {
    var lon = $("#bericht_table tbody #" +rowId+ " td:nth-child(5)").text();
    lon = lon.replace('\u00B0', '');
    lon = parseFloat(lon);
    var lat = $("#bericht_table tbody #" +rowId+ " td:nth-child(4)").text();
    lat = lat.replace('\u00B0', '');
    lat = parseFloat(lat);

    map_obj.CenterMap(map, lon, lat);   //Zentriere die Karte auf die ausgewählten Koordinaten (Längen- und Breitengrad in der ausgewählten Zeile)
  },

  update_follow_device: function(map, last_index_position_array) {
    var deviceId = $('#form_device_value').val();
    var devices = rest.get_devices(deviceId);

    //Start- und Enddatum von den Formularfeldern beziehen und in das von traccar verlangte iso8601-Format bringen
    var iso8601_formatted_start_date = date.iso8601_formattedDate($('#form_start_date_value').val());
    // iso8601_formatted_end_date = date.iso8601_formattedDate($('#form_end_date_value').val());
    var iso8601_formatted_end_date = date.iso8601_formattedDate( date.create_current_date() );

    var positions = rest.get_positions(devices[0].id, iso8601_formatted_start_date, iso8601_formatted_end_date);
    var p = positions;

    if(last_index_position_array == "") {
      return p.length-1;
    }

    var points = [];
    var positions_of_devices = [];

    if( (p.length-1) > last_index_position_array) {
      for(var i=last_index_position_array; i<p.length-1; i++) {

        var last_position_of_devices = new Array();
        last_position_of_devices[0] = new ol.Overlay({
          position: ol.proj.fromLonLat([p[p.length-1].longitude, p[p.length-1].latitude]),  //position,
          positioning: 'center-center',
          element: document.getElementById(p[p.length-1].id),
          stopEvent: false
        });
        map.addOverlay(last_position_of_devices[0]);    //Hinzufügen der Punkte

        for(var i=last_index_position_array; i<p.length-1; i++) {
          var d = document.createElement('div');  //Element erstellen für die Punkte
          var d2 = document.createElement('div'); //Child-Div für Punkt-Divs erstellen, in denen sich die Richtungs-Pfeile befinden
          $(d).addClass('positions_overlay')
              .attr("id", p[i].id);


          $(d2).addClass('position_course')
              .css({WebkitTransform: "rotate(" + (p[i].course) + "deg)"})
              .css({"moz-transform": "rotate(" + (p[i].course) + "deg)"});;

          $(d).append(d2);

          document.getElementById("hidden_map_elements").appendChild(d);   //Elemente in verstecktem Div-Element anlegen

            positions_of_devices[i] = new ol.Overlay({
              position: ol.proj.fromLonLat([p[i].longitude, p[i].latitude]),  //position,
              positioning: 'center-center',
              element: document.getElementById(p[i].id),
              stopEvent: false
            });
            map.addOverlay(positions_of_devices[i]);    //Hinzufügen von Punkt zur Map

          var cords_array = [];
          cords_array.push(p[i].longitude, p[i].latitude);
            points.push(...[cords_array]);

          //Berichts-Tabelle mit Inhalt füllen
          $('#bericht_table tbody').append('<tr id="'+p[i].id+'" class="bericht_table_rows"><td>'+devices[0].name+'</td><td>'+formatBool(p[i].valid)+'</td><td>'+date.iso8601_to_germanDate(p[i].fixTime)+'</td><td>'+p[i].latitude+'\u00B0</td><td>'+p[i].longitude+'\u00B0</td><td>'+p[i].altitude+' m</td> <td>'+p[i].course+'</td> <td>'+formatSpeed(p[i].speed)+'</td><td>'+p[i].address+'</td></tr>');
          // console.log("bla: "+p[i].id);
          scroll_to_table_row_and_select_it(p[i].id);
        }
        map_obj.CenterMap(map, p[p.length-1].longitude, p[p.length-1].latitude);
      }
    }
    //Gib aktuell letzten Array-Index zurück. Bei erneutem Aufruf der Funktion wird verglichen, ob seit dem letzten Aufruf neue Array-Elemente dazugekommen sind.
    return p.length-1;
  },

  mark_last_position_of_all_devices: function(map, devices) {

    iso8601_formatted_start_date = date.iso8601_formattedDate( date.create_last_year_date() );//new Date(0);
    iso8601_formatted_end_date = date.iso8601_formattedDate( date.create_current_date() );
    for(var i=0; i<devices.length; i++) {
      var positions = rest.get_positions(devices[i].id, iso8601_formatted_start_date, iso8601_formatted_end_date);
      // console.log("start: "+iso8601_formatted_start_date+"  ---  ende: "+iso8601_formatted_end_date);
      var p = positions;

      if(p.length>0) {

        var d = document.createElement('div');  //Element erstellen für die Punkte
        var d2 = document.createElement('div'); //Child-Div für Punkt-Divs erstellen, in denen sich die Richtungs-Pfeile befinden
        $(d).addClass('positions_overlay')
            .attr("id", p[p.length-1].id);

        //der letzte Standort bekommt andere Farbe (rot)
        $(d).css("background-color", /*"red"*/configs.last_position_overlay_background_color);

        $(d2).addClass('position_course')
            .css({WebkitTransform: "rotate(" + (p[i].course) + "deg)"})
            .css({"moz-transform": "rotate(" + (p[i].course) + "deg)"});

        $(d).append(d2);

        document.getElementById("hidden_map_elements").appendChild(d);   //Elemente in verstecktem Div-Element anlegen

        var last_position_of_devices = new Array();
        last_position_of_devices[0] = new ol.Overlay({
          position: ol.proj.fromLonLat([p[p.length-1].longitude, p[p.length-1].latitude]),  //position,
          positioning: 'center-center',
          element: document.getElementById(p[p.length-1].id),
          stopEvent: false
        });
        map.addOverlay(last_position_of_devices[0]);    //Hinzufügen der Punkte

        var label_div = document.createElement('div');
        $(label_div).addClass('last_position_label')
                .attr("id", p[p.length-1].id + "_label")//;
                .html(devices[i].name);
        document.body.appendChild(label_div);

        var label = new ol.Overlay({
          position: ol.proj.fromLonLat([p[p.length-1].longitude, p[p.length-1].latitude]),
          element: document.getElementById(p[p.length-1].id + "_label")
        });
        map.addOverlay(label);


        map.getView().setZoom(6);
        map_obj.CenterMap(map, p[p.length-1].longitude, p[p.length-1].latitude);
      }
    }
  }

} //Ende mapobj-Objekt
