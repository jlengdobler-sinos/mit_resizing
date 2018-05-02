

$( document ).ready(function() {

  //Bei Klick auf den Submit-Button des Login-Formulars soll auf die Anmeldedaten geprüft werden
  $( "#login_form" ).submit(function( event ) {
    event.preventDefault();

    // if( $("#login_username").val() == "skipto@t-online.de" && $('#login_password').val() == "test" ) { //testweise nur eigenen Benutzer zulassen
      sessionStorage.setItem("Username", $("#login_username").val() );
      sessionStorage.setItem("Password", $("#login_password").val() );
      // console.log(sessionStorage);
      window.location.replace("main.html");    //Redirect zu Haupt-Seite
    // }else{
    //   alert("Ungültige Anmeldedaten!");
    // }

  });

  $(document).on("click", "#logout_button", function(e){
    sessionStorage.clear();                   //Session löschen
    window.location.replace("index.html");    //Redirect zu Login-Seite
  });

  // var value = sessionStorage.getItem("MyId");

});
