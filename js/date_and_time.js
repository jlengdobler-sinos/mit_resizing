
var date = {
  create_current_date: function() {
    var current_date = new Date();
    var dd = current_date.getDate();
    var mm = current_date.getMonth()+1; //January is 0!
    var yyyy = current_date.getFullYear();

    var hour = current_date.getHours();
    var min = current_date.getMinutes();
    var sec = current_date.getSeconds();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    current_date = dd + '.' + mm + '.' + yyyy + " " + hour + ":" + min + ":" + sec;
    return current_date;
  },
  create_last_year_date: function() {
    var last_year_date = new Date();
    var dd = last_year_date.getDate();
    var mm = last_year_date.getMonth()+1; //January is 0!
    var yyyy = last_year_date.getFullYear()-1;

    var hour = last_year_date.getHours();
    var min = last_year_date.getMinutes();
    var sec = last_year_date.getSeconds();

    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    last_year_date = dd + '.' + mm + '.' + yyyy + " " + hour + ":" + min + ":" + sec;
    return last_year_date;
  },
  iso8601_formattedDate: function(dateString) {
    // console.log(dateString);

    var day = parseInt(dateString.substr(0,2) );
    var month = parseInt(dateString.substr(3,2) );
    var year = parseInt(dateString.substr(6,4) );

    // if(day < 10) {
    //   day = "0" + day;
    // }
    // if(month < 10) {
    //   month = "0" + month;
    // }

    var hour = parseInt(dateString.substr(11,2) );// - 1;
    // var test = dateString.substr(13,6);
    var min = dateString.substr(14,2);
    var sec = dateString.substr(17,2);

    var d = new Date(year,month,day, hour, min, sec);

    if(hour < 10) {
      hour = "0" + hour;
    }

    if(day < 10) {
      day = "0" + day;
    }
    if(month < 10) {
      month = "0" + month;
    }

    formatted_date = year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec + "Z";
    // console.log(formatted_date);    // 2018-03-31T22:59:59Z
    return formatted_date;
  },
  iso8601_to_germanDate: function(dateString) {
    if(dateString === null){
      return "";
    }

    dateString = dateString.replace("T", " ").substring(0, dateString.indexOf('.'));

    formatted_date = dateString.substr(8,2) + "." + dateString.substr(5,2) + "." + dateString.substr(0,4) + " " + dateString.substr(11,8);
    return formatted_date;
  },
  get_current_date_in_format_iso8601: function() {
    //http://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
    var timezone_offset_min = new Date().getTimezoneOffset(),
    offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
    timezone_standard = 'Z';    //scheinbar nimmt traccar nur datum an, das GMT 0 hat, also muss ggf. die Zeit angepasst werden

    var dt = new Date(),
  	current_date = dt.getDate(),
  	current_month = dt.getMonth() + 1,
  	current_year = dt.getFullYear(),
  	current_hrs = dt.getHours() - offset_hrs,
  	current_mins = dt.getMinutes(),
  	current_secs = dt.getSeconds(),
  	current_datetime;

    // 0 anhängen, falls kleiner als 10
    current_date = current_date < 10 ? '0' + current_date : current_date;
    current_month = current_month < 10 ? '0' + current_month : current_month;
    current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
    current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
    current_secs = current_secs < 10 ? '0' + current_secs : current_secs;

    current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs;

    var string = current_datetime + timezone_standard;
    return string;
  },
  time_frame_select_get_last_hour: function() {
    var today = new Date;

    var today_day = today.getDate();
    var today_month = today.getMonth() + 1;
    var today_year = today.getFullYear();

    today_day = today_day < 10 ? '0' + today_day : today_day;
    today_month = today_month < 10 ? '0' + today_month : today_month;

    var today_hour = today.getHours() - 1;
    var today_min = today.getMinutes();
    var today_sec = today.getSeconds();

    today_hour = today_hour < 10 ? '0' + today_hour : today_hour;
    today_min = today_min < 10 ? '0' + today_min : today_min;
    today_sec = today_sec < 10 ? '0' + today_sec : today_sec;


    today_string = today_day + "." + today_month + "." + today_year + " " + today_hour + ":" + today_min + ":" + today_sec;

    $('#parameters_select_start_date').val(today_string);
    $('#form_start_date_value').val(today_string);

    var current_time = date.create_current_date();

    $('#parameters_select_end_date').val(current_time);
    $('#form_end_date_value').val(current_time);
  },
  time_frame_select_get_today: function() {
    var today = new Date;

    var today_day = today.getDate();
    var today_month = today.getMonth() + 1;
    var today_year = today.getFullYear();

    today_day = today_day < 10 ? '0' + today_day : today_day;
    today_month = today_month < 10 ? '0' + today_month : today_month;

    today_string = today_day + "." + today_month + "." + today_year + " " + "00:00:00";

    $('#parameters_select_start_date').val(today_string);
    $('#form_start_date_value').val(today_string);

    var current_time = date.create_current_date();

    $('#parameters_select_end_date').val(current_time);
    $('#form_end_date_value').val(current_time);
  },
  time_frame_select_get_yesterday: function() {
    var yesterday = new Date;
    yesterday.setDate(yesterday.getDate() - 1);

    var yesterday_day = yesterday.getDate();
    var yesterday_month = yesterday.getMonth() + 1;
    var yesterday__year = yesterday.getFullYear();

    yesterday_day = yesterday_day < 10 ? '0' + yesterday_day : yesterday_day;
    yesterday_month = yesterday_month < 10 ? '0' + yesterday_month : yesterday_month;

    yesterday_start_string = yesterday_day + "." + yesterday_month + "." + yesterday__year + " " + "00:00:00";
    yesterday_end_string = yesterday_day + "." + yesterday_month + "." + yesterday__year + " " + "23:59:59";

    $('#parameters_select_start_date').val(yesterday_start_string);
    $('#form_start_date_value').val(yesterday_start_string);

    $('#parameters_select_end_date').val(yesterday_end_string);
    $('#form_end_date_value').val(yesterday_end_string);
  },
  time_frame_select_get_current_week: function() {
    var curr = new Date; // get current date

    curr.setDate(curr.getDate());

    var day = curr.getDay();
    var diff = curr.getDate() - day + (day == 0 ? -6 : 1);
    var this_monday = new Date(curr.setDate(diff));

    var this_monday_day = this_monday.getDate();
    var this_monday_month = this_monday.getMonth() + 1;
    var this_monday_year = this_monday.getFullYear();

    this_monday_day = this_monday_day < 10 ? '0' + this_monday_day : this_monday_day;
    this_monday_month = this_monday_month < 10 ? '0' + this_monday_month : this_monday_month;

    this_monday_string = this_monday_day + "." + this_monday_month + "." + this_monday_year + " " + "00:00:00";

    $('#parameters_select_start_date').val(this_monday_string);
    $('#form_start_date_value').val(this_monday_string);

    var today_string = date.create_current_date();

    $('#parameters_select_end_date').val(today_string);
    $('#form_end_date_value').val(today_string);
  },
  time_frame_select_get_last_week: function() {
    var curr = new Date; // get current date

    curr.setDate(curr.getDate());

    var day = curr.getDay();
    var diff = curr.getDate() - 7 - day + (day == 0 ? -6 : 1);
    var last_monday = new Date(curr.setDate(diff));

    var last_monday_day = last_monday.getDate();
    var last_monday_month = last_monday.getMonth() + 1;
    var last_monday_year = last_monday.getFullYear();

    last_monday_day = last_monday_day < 10 ? '0' + last_monday_day : last_monday_day;
    last_monday_month = last_monday_month < 10 ? '0' + last_monday_month : last_monday_month;

    last_monday_string = last_monday_day + "." + last_monday_month + "." + last_monday_year + " " + "00:00:00";

    $('#parameters_select_start_date').val(last_monday_string);
    $('#form_start_date_value').val(last_monday_string);


    var curr2 = new Date;
    curr2.setDate(curr2.getDate());

    var diff_2 = curr2.getDate() -1 - day + (day == 0 ? -6 : 1);
    var last_sunday = new Date(curr2.setDate(diff_2));

    var last_sunday_month = curr2.getMonth() + 1;
    var last_sunday_year = curr2.getFullYear();

    var last_sunday_day = last_sunday.getDate();

    last_sunday_day = last_sunday_day < 10 ? '0' + last_sunday_day : last_sunday_day;
    last_sunday_month = last_sunday_month < 10 ? '0' + last_sunday_month : last_sunday_month;

    last_sunday_string = last_sunday_day + "." + last_sunday_month + "." + last_sunday_year + " " + "23:59:59";

    $('#parameters_select_end_date').val(last_sunday_string);
    $('#form_end_date_value').val(last_sunday_string);
  },
  time_frame_select_get_current_month: function() {
    var curr_date = new Date();
    curr_date.setDate(curr_datecurr_date.getDate());
    var firstDay = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);    //get first day of month
    // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); //get last day of month

    var first_day_of_month_day = firstDay.getDate();
    var first_day_of_month_month = firstDay.getMonth() + 1;
    var first_day_of_month_year = firstDay.getFullYear();

    first_day_of_month_day = first_day_of_month_day < 10 ? '0' + first_day_of_month_day : first_day_of_month_day;
    first_day_of_month_month = first_day_of_month_month < 10 ? '0' + first_day_of_month_month : first_day_of_month_month;

    var first_day_of_month_string = first_day_of_month_day + "." + first_day_of_month_month + "." + first_day_of_month_year + " 00:00:00";

    $('#parameters_select_start_date').val(first_day_of_month_string);
    $('#form_start_date_value').val(first_day_of_month_string);

    var current_time = date.create_current_date();

    $('#parameters_select_end_date').val(current_time);
    $('#form_end_date_value').val(current_time);
  },
  time_frame_select_get_last_month: function() {
    var date = new Date();
    date.setDate(date.getDate());
    date.setMonth(date.getMonth() - 1);
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);    //get first day of month
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); //get last day of month

    var first_day_of_month_day = firstDay.getDate();
    var first_day_of_month_month = firstDay.getMonth() + 1;
    var first_day_of_month_year = firstDay.getFullYear();

    first_day_of_month_day = first_day_of_month_day < 10 ? '0' + first_day_of_month_day : first_day_of_month_day;
    first_day_of_month_month = first_day_of_month_month < 10 ? '0' + first_day_of_month_month : first_day_of_month_month;

    var last_day_of_month_day = lastDay.getDate();
    var last_day_of_month_month = lastDay.getMonth() + 1;
    var last_day_of_month_year = lastDay.getFullYear();

    last_day_of_month_day = last_day_of_month_day < 10 ? '0' + last_day_of_month_day : last_day_of_month_day;
    last_day_of_month_month = last_day_of_month_month < 10 ? '0' + last_day_of_month_month : last_day_of_month_month;

    var first_day_of_month_string = first_day_of_month_day + "." + first_day_of_month_month + "." + first_day_of_month_year + " 00:00:00";

    $('#parameters_select_start_date').val(first_day_of_month_string);
    $('#form_start_date_value').val(first_day_of_month_string);

    var last_day_of_month_string = last_day_of_month_day + "." + last_day_of_month_month + "." + last_day_of_month_year + " 23:59:59";

    $('#parameters_select_end_date').val(last_day_of_month_string);
    $('#form_end_date_value').val(last_day_of_month_string);
  }

}

// function create_yesterday_date() {
//
//   var yesterday_date = new Date();
//   dd = yesterday_date.setDate(yesterday_date.getDate() - 19);
//   yesterday_date = yesterday_date.toLocaleString();
//
//   yesterday_date = yesterday_date.replace(",", "");
//
//   if(yesterday_date[1] == ".") {
//     yesterday_date = "0" + yesterday_date;
//   }
//   if(yesterday_date[4] == ".") {
//     yd = yesterday_date;
//     yesterday_date = yd[0] + yd[1] + yd[2] + "0" + yd[3] + yd[4] + yd[5] + yd[6] + yd[7] + yd[8] + yd[9] + yd[10] + yd[11] + yd[12] + yd[13] + yd[14] + yd[15] + yd[16] + yd[17];
//   }
//
//   return yesterday_date;
// }
