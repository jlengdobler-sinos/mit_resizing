var map = "";
var last_index_position_array = "";

// console.log(sessionStorage);

$( document ).ready(function() {

  var anpassung = 0;
  if (navigator.userAgent.indexOf("Firefox") != -1) {
    anpassung = 1;
  }
  // var $table = $('table.scroll'),
  //     $bodyCells = $table.find('tbody tr:first').children(),
  var $table = $('#bericht_table_header_fake'),
      $test = $('#bericht_table');
      $bodyCells = $test.find('tbody tr:first').children(),
      // bodyCells = $('#bericht_table');
      colWidth;

  // Adjust the width of thead cells when window resizes
  $(window).resize(function() {
      // Get the tbody columns width array
      colWidth = $bodyCells.map(function() {
          return $(this).width();
      }).get();

      // Set the width of thead columns
      $table.find('thead tr').children().each(function(i, v) {
        // console.log("each");
          $(v).width(colWidth[i] - anpassung);
      });
  }).resize(); // Trigger resize handler


  $('#parameters_select_default_time_frames').on('change', function() {

    // $('#form_start_date_value').val( $('#parameters_select_start_date').val() );
    // $('#form_end_date_value').val( $('#parameters_select_end_date').val() );

    // $('#parameters_select_devices').children("option").filter(":selected").val()

    if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "letzte_stunde" ) {
      date.time_frame_select_get_last_hour();
    }else if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "heute" ) {
      date.time_frame_select_get_today();
    }else if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "gestern"  ) {
      date.time_frame_select_get_yesterday();
    }else if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "diese_woche" ) {
      date.time_frame_select_get_current_week();
    }else if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "letzte_woche" ) {
      date.time_frame_select_get_last_week();
    }else if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "dieser_monat" ) {
      date.time_frame_select_get_current_month();
    }else if( $('#parameters_select_default_time_frames').children("option").filter(":selected").val() == "letzter_monat" ) {
      date.time_frame_select_get_last_month();
    }

  });

  $(document).on("click", "#option_folgen", function(e){
    styling.option_follow_toggle_class();

    if( $('#option_folgen').hasClass("option_follow_active") ) {
      var deviceId = $('#form_device_value').val();

      var devices = rest.get_devices(deviceId);

      //Start- und Enddatum von den Formularfeldern beziehen und in das von traccar verlangte iso8601-Format bringen
      var iso8601_formatted_start_date = date.iso8601_formattedDate($('#form_start_date_value').val());
      var iso8601_formatted_end_date = date.iso8601_formattedDate($('#form_end_date_value').val());

      var positions = rest.get_positions(devices[0].id, iso8601_formatted_start_date, iso8601_formatted_end_date);
      var p = positions;

      map_obj.CenterMap(map, p[p.length-1].longitude, p[p.length-1].latitude);
    }
  });


    setInterval(function() {
      if( $("#option_folgen").css('display') != 'none' && $('#option_folgen').hasClass("option_follow_active") ) {

        // method to be executed;
        last_index_position_array = map_obj.update_follow_device(map, last_index_position_array);
      }
    }, 5000); //wird alle 5 Sekunden ausgeführt

  //Eingeloggten Nutzer eintragen bei "Angemeldet als: "
  $('#logged_in_user u').text( sessionStorage.getItem('Username') );

  //Standardwerte in Datum-Inputfelder eintragen
  date.time_frame_select_get_last_hour();
  // $('#parameters_select_start_date').val( create_yesterday_date() );
  // $('#parameters_select_end_date').val( create_current_date() );
  //...und in versteckte Input-Felder übernehmen
  $('#form_start_date_value').val( $('#parameters_select_start_date').val() );
  $('#form_end_date_value').val( $('#parameters_select_end_date').val() );
  // create_current_date();

  // Change the selector if needed
  var $table = $('#bericht_table.scroll'),
      $bodyCells = $table.find('tbody tr:first').children(),
      colWidth;

  // Adjust the width of thead cells when window resizes
  $(window).resize(function() {
      // Get the tbody columns width array
      colWidth = $bodyCells.map(function() {
          return $(this).width();
      }).get();

      // Set the width of thead columns
      $table.find('thead tr').children().each(function(i, v) {
          $(v).width(colWidth[i]);
      });
  }).resize(); // Trigger resize handler

  styling.add_group_parameter_options();
  styling.add_device_parameter_options();

  $('#form_group_value').val(''+ $('#parameters_select_groups').children("option").filter(":selected").val() );
  $('#form_device_value').val(''+ $('#parameters_select_devices').children("option").filter(":selected").val() );

  map = map_obj.create_ol_map();

  $("#parameters_select_groups").change(function() {
    $('#form_group_value').val(''+ $('#parameters_select_groups').children("option").filter(":selected").val() );
  });

  $("#parameters_select_devices").change(function() {
    $('#form_device_value').val(''+ $('#parameters_select_devices').children("option").filter(":selected").val() );

    if( $('#form_device_value').val() == "Alle" ) {
      $("#parameters_select_default_time_frames").prop('disabled', 'disabled');
    }else {
      $("#parameters_select_default_time_frames").removeAttr("disabled");
    }

  });

  $("#last_position").on("click", function() {

  });


  $(document).on("click", ".positions_overlay", function(e){
    e.preventDefault();
    var rowId = $(this).attr('id');
    var deviceId = $('#form_device_value').val();
    var devices = rest.get_devices(deviceId);

    styling.update_status_table(deviceId, rowId);

    //TODO rausbekommen, welche zeilenhöhe vorhanden ist und die wievielte zeile die benötigte id hat   ->  http://jsfiddle.net/S64w7/1/

    styling.scroll_to_table_row_and_select_it(rowId);
  });

  // Bei Klick auf eine Zeile in der Berichts-Tabelle soll der dazugehörige Koordinatenpunkt ermittelt, farblich erkennbar gemacht und auf der Karte zentriert werden
  $(document).on("click", "#bericht_table tbody .bericht_table_rows", function(e){    //Bei Click auf eine Zeile der Berichts-Tabelle (nur im tbody)

    var rowId = $(this).attr('id');

    var deviceId = $('#form_device_value').val();
    var devices = rest.get_devices(deviceId);

    styling.update_status_table(deviceId, rowId);

    map_obj.get_cords_from_bericht_table_to_center_map(rowId, map);
    styling.style_bericht_table_on_click(rowId);
  });


  //Bei Klick auf Anzeigen-Button
  $(document).on("click", "#bericht_konfigurieren_anzeigen-button", function(e){

    styling.option_follow_remove_class();

    $('#bericht_table_header_fake').css("display", "");
    $("#bericht_table tbody").empty();                  //tbody von Berichtstabelle leeren, um alte Berichte zu löschen

    map_obj.remove_all_overlays(map);
    map_obj.remove_all_layers_except_first_layer(map);

    var deviceId = $('#form_device_value').val();

    var devices = rest.get_devices(deviceId);
    //Start- und Enddatum von den Formularfeldern beziehen und in das von traccar verlangte iso8601-Format bringen
    var iso8601_formatted_start_date = date.iso8601_formattedDate($('#form_start_date_value').val());
    var iso8601_formatted_end_date = date.iso8601_formattedDate($('#form_end_date_value').val());


    // iso8601_formatted_start_date = create_current_date(); //iso8601_formattedDate();
    // console.log("test12: "+iso8601_formatted_start_date);
    // console.log("test123: "+iso8601_formatted_end_date);


    //Wenn alle Devices angezeigt werden sollen, zeige von allen Devices nur den letzten Standort
    if(deviceId == "Alle") {
      $("#status_table thead, #status_table tbody").css("display", "none");
      styling.hide_option_folgen(devices);
      map_obj.mark_last_position_of_all_devices(map, devices, iso8601_formatted_start_date, iso8601_formatted_end_date);
      return 0;
    }

    var positions = rest.get_positions(deviceId, iso8601_formatted_start_date, iso8601_formatted_end_date);
    var p = positions;

    // Wenn keine Einträge für das ausgewählte Fahrzeug existieren, gebe eine entsprechende Meldung aus
    if(p.length == 0) {
      $("#status_table thead, #status_table tbody").css("display", "none"); // Status-Tabelle verbergen, da es keine Werte gibt
      alert("Keine Einträge für den ausgewählten Zeitraum gefunden");       // Meldung ausgeben
      return 0;
    }

    styling.show_status_table_with_latest_position(p);
    $('.last_position').remove();


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
            .html(devices[0].name);
    document.body.appendChild(label_div);

    //Label für letzten Standort
    var label = new ol.Overlay({
      position: ol.proj.fromLonLat([p[p.length-1].longitude, p[p.length-1].latitude]),
      element: document.getElementById(p[p.length-1].id + "_label")
    });
    map.addOverlay(label);

    map_obj.CenterMap(map, p[p.length-1].longitude, p[p.length-1].latitude);



    var points = [];
    var positions_of_devices = [];

    $('.positions_overlay').remove();
    //Die Positionen in einer Schleife durchlaufen und in einem Array in folgendem Format abspeichern:  { {punkt1_longitude, punkt1_latitude} {punkt2_longitude, punkt2_latitude} ... }
    for(var i=0; i<p.length-1; i++) {

      var d = document.createElement('div');  //Element erstellen für die Punkte
      var d2 = document.createElement('div'); //Child-Div für Punkt-Divs erstellen, in denen sich die Richtungs-Pfeile befinden
      $(d).addClass('positions_overlay')
          .attr("id", p[i].id);

      /**/
      var d3 = document.createElement('span');
      // d3.textContent = "test";
      $(d3).addClass('tooltiptext');
      // console.log(deviceId);
      // console.log(p[i].id);

      //TODO für jeden Punkt einen Tooltip generieren, der wie auf dem alten Sinos-Portal die wichtigsten Informationen anzeigt. Später dann aber nur nach Klick auf den Punkt und nicht bei Hover
      // styling.show_tooltip_on_click_on_position_overlay(deviceId, p[i].id);
      // d3.textContent = "test";
      /**/

      //der letzte Standort bekommt andere Farbe
      if(i == p.length-2) {
        $(d).css("background-color", /*"red"*/configs.last_position_overlay_background_color);
      }

      $(d2).addClass('position_course')
          .css({WebkitTransform: "rotate(" + (p[i].course) + "deg)"})
          .css({"moz-transform": "rotate(" + (p[i].course) + "deg)"});;

      $(d).append(d2);
      /**/
      $(d).append(d3);
      /**/

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
      // $('#bericht_table tbody').append('<tr id="'+p[i].id+'" class="bericht_table_rows"><td>'+devices[0].name+'</td><td>'+formatBool(p[i].valid)+'</td><td>'+date.iso8601_to_germanDate(p[i].fixTime)+'</td><td>'+p[i].latitude+'\u00B0</td><td>'+p[i].longitude+'\u00B0</td><td>'+p[i].altitude+' m</td> <td>'+p[i].course+'</td> <td>'+formatSpeed(p[i].speed)+'</td><td>'+p[i].address+'</td></tr>');
      $('#bericht_table tbody').append('<tr id="'+p[i].id+'" class="bericht_table_rows"><td>'+devices[0].name+'</td><td>'+format.bool(p[i].valid)+'</td><td>'+date.iso8601_to_germanDate(p[i].fixTime)+'</td><td>'+p[i].latitude+'\u00B0</td><td>'+p[i].longitude+'\u00B0</td><td>'+p[i].altitude+' m</td> <td>'+p[i].course+'</td> <td>'+format.speed(p[i].speed)+'</td><td>'+p[i].address+'</td></tr>');
    }

    // console.log(points);

    //anzeigen von Berichts-Tabelle, nachdem Bericht erstellt wurde
    $('#bericht_table_header_fake').css("display", "table");
    $('#bericht_table').css("display", "block");
    // $('#bericht_table thead').css("display", "");


    // styling.resize_berichte_table();

    /**/
    var anpassung = 0;
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      anpassung = 1;
    }
    // var $table = $('table.scroll'),
    //     $bodyCells = $table.find('tbody tr:first').children(),
    var $table = $('#bericht_table_header_fake'),
        $test = $('#bericht_table');
        $bodyCells = $test.find('tbody tr:first').children(),
        // bodyCells = $('#bericht_table');
        colWidth;

    // Adjust the width of thead cells when window resizes
    $(window).resize(function() {
        // Get the tbody columns width array
        colWidth = $bodyCells.map(function() {
            return $(this).width();
        }).get();

        // console.log($table);
        // console.log($bodyCells);
        // console.log(colWidth);

        // Set the width of thead columns
        $table.find('thead tr').children().each(function(i, v) {
          // console.log("each");
          // console.log(colWidth[i]);
            $(v).width(colWidth[i] - anpassung);
            // console.log(v);
        });
    }).resize(); // Trigger resize handler
    /**/



    //Positionen mit Strichen verbinden   ->https://stackoverflow.com/questions/9765224/draw-line-between-two-points-using-openlayers
    for (var i = 0; i < points.length; i++) {
        points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
    }
    var featureLine = new ol.Feature({
        geometry: new ol.geom.LineString(points)
    });

    var vectorLine = new ol.source.Vector({});
    vectorLine.addFeature(featureLine);

    var vectorLineLayer = new ol.layer.Vector({
        source: vectorLine,
        style: new ol.style.Style({
            // fill: new ol.style.Fill({ color: '#426A92', weight: 1 }),
            stroke: new ol.style.Stroke({ color: /*'#426A92'*/configs.linking_lines_background_color, width: configs.linking_lines_width })
        })
    });

    map.addLayer(vectorLineLayer);          //Hinzufügen der Linien, die die einzelnen Punkte verbinden
    // console.log( map.getOverlays() );
    // map.removeLayer(vectorLineLayer);
  });


});   //Ende von $( document ).ready(function()
