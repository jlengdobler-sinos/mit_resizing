
var styling = {
  resize_berichte_table: function() {
    var anpassung = 0;
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      anpassung = 1;
    }

    var $table = $('table.scroll'),
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
            $(v).width(colWidth[i] - anpassung);
        });
    }).resize(); // Trigger resize handler
  },
  style_bericht_table_on_click: function(rowId) {
    $("#bericht_table tbody .bericht_table_rows").css("color", "");                   //Schriftfarbe von allen Zeilen zurücksetzen
    $("#bericht_table tbody .bericht_table_rows").css("background-color", "");        //Hintergrundfarbe von allen Zeilen zurücksetzen

    $("#bericht_table tbody #"+ rowId).css("color", "white");                                                   //Schriftfarbe von ausgewählter Zeile ändern
    $("#bericht_table tbody #"+ rowId).css("background-color", configs.bericht_table_selected_row_background_color);    //Hintergrundfarbe von ausgewählter Zeile ändern

    $(".positions_overlay").css("background-color", "");                                                        //Hintergrundfarbe von allen Punkten zurücksetzen
    $(".ol-overlay-container #"+ rowId ).css("background-color", configs.position_selected_overlay_background_color);   //Hintergrundfarbe für ausgewählten Punkt ändern
  },
  option_follow_toggle_class: function() {
    if( $('#option_folgen').hasClass("option_follow_active") ) {
      $('#option_folgen').removeClass("option_follow_active");
    }else if( !$('#option_folgen').hasClass("option_follow_active") ) {
      $('#option_folgen').addClass("option_follow_active");
    }
  },
  option_follow_remove_class: function() {
    if( $('#option_folgen').hasClass("option_follow_active") ) {
      $('#option_folgen').removeClass("option_follow_active");
    }
  },
  scroll_to_table_row_and_select_it: function(rowId) {
    //Auf die Zeile im Berichts-Table scrollen, die zu dem angeklickten Overlay gehört (selbe ID)
    $('#bericht_table_container').scrollTop(0);   //TODO bessere Lösung finden
    $('#bericht_table_container').scrollTop( $("#bericht_table tbody #"+ $('#'+rowId).attr('id') ).offset().top - 800 );
    //TODO bei den last_position overlays nach Wahl der Option "Alle" bei Fahrzeug ist der offset in der Zeile oben ungesetzt
    $(".positions_overlay").css("background-color", "");                                  //Hintergrundfarbe von allen Punkten zurücksetzen
    $('#'+rowId).css("background-color", configs.position_selected_overlay_background_color);//Hintergrundfarbe für ausgewählten Punkt ändern
    // $(".positions_overlay").css({"width" : "20px", "height" : "20px"})                    //Größe von allen Punkten zurücksetzen
    // $('#'+rowId).css({"width" : "20px", "height" : "20px"});                              //Größe für ausgewählten Punkt ändern

    $("#bericht_table tbody .bericht_table_rows").css("background-color", "");            //Hintergrundfarbe von allen Zeilen zurücksetzen
    $("#bericht_table tbody #" +$('#'+rowId).attr('id') ).css("background-color", configs.bericht_table_selected_row_background_color/*"#9caabf"*/);  //Hintergrundfarbe von ausgewählter Zeile ändern

    $("#bericht_table tbody .bericht_table_rows").css("color", "");                       //Schriftfarbe von allen Zeilen zurücksetzen
    $("#bericht_table tbody #" +$('#'+rowId).attr('id') ).css("color", configs.bericht_table_selected_row_text_color);          //Schriftfarbe von ausgewählter Zeile ändern
  },
  show_option_folgen: function() {
    $("#status_header #option_folgen").css("display", "inline-block");
  },
  hide_option_folgen: function() {
    $("#status_header #option_folgen").css("display", "none");
  },
  update_status_table: function(deviceId, position_id) {
    var iso8601_formatted_start_date = date.iso8601_formattedDate($('#form_start_date_value').val());
    var iso8601_formatted_end_date = date.iso8601_formattedDate($('#form_end_date_value').val());
    var positions = rest.get_positions(deviceId, iso8601_formatted_start_date, iso8601_formatted_end_date, position_id);
    var p = positions;

    if(p.length === 0) {
      $("#status_table thead, #status_table tbody").css("display", "none");
      return;
    }

    $("#status_table thead, #status_table tbody").css("display", "block");

    $('#status_fixtime').text(date.iso8601_to_germanDate(p[p.length-1].fixTime));
    $('#status_latitude').text(p[p.length-1].latitude +'\u00B0');
    $('#status_longitude').text(p[p.length-1].longitude +'\u00B0');
    $('#status_valid').text(format.bool(p[p.length-1].valid));
    $('#status_accuracy').text(format.distance(p[p.length-1].accuracy));
    $('#status_altitude').text(p[p.length-1].altitude + " Meter");
    $('#status_speed').text(format.speed(p[p.length-1].speed));
    $('#status_course').text(format.course(p[p.length-1].course));
    $('#status_address').text(p[p.length-1].address);
    $('#status_protocol').text(p[p.length-1].protocol);
    $('#status_batterylevel').text(p[p.length-1].attributes.batteryLevel+' %');
    $('#status_distance').text(format.distance(p[p.length-1].attributes.distance));
    $('#status_totalDistance').text(format.distance(p[p.length-1].attributes.totalDistance));
    $('#status_motion').text(format.bool(p[p.length-1].attributes.motion));
  },
  /**/
  show_tooltip_on_click_on_position_overlay: function(deviceId, position_id) {
    var positions = rest.get_positions(deviceId, position_id);
    var p = positions;
    console.log(p);
  },
  /**/
  show_status_table_with_latest_position: function(positions_array) {
    styling.show_option_folgen();

    var p = positions_array;

    if(p.length === 0) {
      $("#status_table thead, #status_table tbody").css("display", "none");
      return;
    }

    $("#status_table thead, #status_table tbody").css("display", "block");

    $('#status_fixtime').text(date.iso8601_to_germanDate(p[p.length-1].fixTime));
    $('#status_latitude').text(p[p.length-1].latitude +'\u00B0');
    $('#status_longitude').text(p[p.length-1].longitude +'\u00B0');
    $('#status_valid').text(format.bool(p[p.length-1].valid));
    $('#status_accuracy').text(format.distance(p[p.length-1].accuracy));
    $('#status_altitude').text(p[p.length-1].altitude + " Meter");
    $('#status_speed').text(format.speed(p[p.length-1].speed));
    $('#status_course').text(format.course(p[p.length-1].course));
    $('#status_address').text(p[p.length-1].address);
    $('#status_protocol').text(p[p.length-1].protocol);
    $('#status_batterylevel').text(p[p.length-1].attributes.batteryLevel+' %');
    $('#status_distance').text(format.distance(p[p.length-1].attributes.distance));
    $('#status_totalDistance').text(format.distance(p[p.length-1].attributes.totalDistance));
    $('#status_motion').text(format.bool(p[p.length-1].attributes.motion));
  },
  add_group_parameter_options: function() {
    var groups = new Array();
    groups = rest.get_groups();
    for(var i=0; i<groups.length; i++) {
      if( !($('#parameters_select_groups option[value=' +groups[i].id+ ']').length > 0) ){
        $("#parameters_select_groups").append('<option value='+groups[i].id+'>'+groups[i].name+'</option>'); //je eine Option für jeden Device hinzufügen
      }
    }
  },
  add_device_parameter_options: function() {
    var devices = new Array();
    devices = rest.get_devices();
    for(var i=0; i<devices.length; i++) {
      if( !($('#parameters_select_devices option[value=' +devices[i].id+ ']').length > 0) ){
        $("#parameters_select_devices").append('<option value='+devices[i].id+'>'+devices[i].name+'</option>'); //je eine Option für jeden Device hinzufügen
        // $('#devices_table tbody').append('<tr id="'+devices[i].id+'" class="devices_row"><td class="device_name">'+devices[i].name+'</td><td class="device_status">'+devices[i].status+'</td><td class="device_last_update">'+date.iso8601_to_germanDate(devices[i].lastUpdate)+'</td></tr>');
      }
    }
  }

}
