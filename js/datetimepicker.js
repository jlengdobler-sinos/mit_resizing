//https://xdsoft.net/jqplugins/datetimepicker/


$( document ).ready(function() {

  $('#parameters_select_start_date').datetimepicker();
  $('#parameters_select_end_date').datetimepicker();

  $('#parameters_select_start_date').datetimepicker({
    onChangeDateTime:function(dp,$input){

      var date = $('#parameters_select_start_date').datetimepicker('getDate');
      $('#form_start_date_value').val( date[0].value );
      // console.log($('#form_start_date_value').val());
    }
  });

  $('#parameters_select_end_date').datetimepicker({
    onChangeDateTime:function(dp,$input){

      var date = $('#parameters_select_end_date').datetimepicker('getDate');
      $('#form_end_date_value').val( date[0].value );
    }
  });

  //Wochenendtage ausgrauen
  $('#parameters_select_start_date, #parameters_select_end_date').datetimepicker({
    onGenerate:function( ct ){
      $(this).find('.xdsoft_date.xdsoft_weekend')
        .addClass('xdsoft_disabled');
    },
    // weekends:['01.01.2014','02.01.2014','03.01.2014','04.01.2014','05.01.2014','06.01.2014'],
    timepicker:true
  });

  $.datetimepicker.setLocale('de');
  $('#parameters_select_start_date, #parameters_select_end_date').datetimepicker({
   i18n:{
    de:{
     months:[
      'Januar','Februar','März','April',
      'Mai','Juni','Juli','August',
      'September','Oktober','November','Dezember',
     ],
     dayOfWeek:[
      "So.", "Mo", "Di", "Mi",
      "Do", "Fr", "Sa.",
     ]
    }
   },
   timepicker:true,
   format:'d.m.Y H:m:i'
  });

  $('#parameters_select_start_date').datetimepicker({
    formatDate:'d.m.Y',
    // minDate:'-1970/01/02',//yesterday is minimum date(for today use 0 or -1970/01/01)
    maxDate:'0',//tomorrow is maximum date calendar
    yearStart:'2000',
    yearEnd:'2018'
  });

  $('#parameters_select_end_date').datetimepicker({
    formatDate:'d.m.Y',
    minDate:'0',//yesterday is minimum date(for today use 0 or -1970/01/01)
    // maxDate:'0'//tomorrow is maximum date calendar
    yearStart:'2018',
    yearEnd:'2025'
  });

});
