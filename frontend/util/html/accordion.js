
function createAccordion(div,courseName, exercises) {

    var text= userDetails.country_id; 
    var grade=0;
    var discription= "Pid signals";
    $(div).append('<button class="accordion">'+courseName+'</button>'+
    '<div class="panel">'+
    '<div class="panel-body">'+
    '<div class="exercise"><h4>'+exercises+'</h4>'+
    '<p>'+discription+'</p>'+
    '<button name="Vu1XBFXwv7aXLWnWuTADwBUOzQD2_1" id="dl" class="btn btn-link =">Download PDF</button>'+
    '<br><br><pre>For the submission with the id(s): '+userDetails.country_id+'. <br>'+
    'Your current grade is: <strong> <font color="dc2f0a">'+grade+'</font></strong>.'+
     '<br>Submitted on: Thu Jun 06 2019 12:21:34 GMT+0300 (Israel Daylight Time). </pre>'+
     '<p>'+
         '<button name="Vu1XBFXwv7aXLWnWuTADwBUOzQD2_1" id="solve" class="btn btn-success =">Solve</button>'+
    '</p>'+
'</div>'+
'<!--exercise--></div>'+
    '</div>');    
 
}





function accordion_listener(name){
    var acc = document.getElementsByClassName(name);
    var i;

    for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
        panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }
    });
    } 
}
