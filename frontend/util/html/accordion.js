
// function createAccordion(div, courseName, exercises) {
//     let html = '<button class="accordion">' + courseName + '</button>' +
//         '<div class="panel">' +
//         '<div class="panel-body">';
//     for (exercise of exercises) {
//         html += accordionBody(exercise)
//     }
//     html += '</div>' +
//         '</div>'
//     $(div).append(html);
// }

// function accordionBody(exercise) {
//     let exerciseName = "Exercise Name"
//     let grade = 0;
//     let description = "Short description:";
//     let timeStamp = "Thu Jun 06 2019 12:21:34 GMT+0300 (Israel Daylight Time)."
//     return '<div class="exercise" name="Vu1XBFXwv7aXLWnWuTADwBUOzQD2_1">' +
//         '<pre>' +
//         '<div class="exerciseName">' + exerciseName + '</div>' +
//         '<div class="description">Short description: ' + description + '</div>' +
//         '<div class="btn btn-link">Download PDF</div>' +
//         '<div class="result">' +
//         '<pre>' +
//         '<div class=countryId>For the submission with the id(s): ' + userDetails.country_id + '</div>' +
//         '<div class=grade>Your current grade is: ' + grade + '</div>' +
//         '<div class=timestamp>Submitted on:' + timeStamp + '</div>' +
//         '</pre>' +
//         '<div class="btn btn-success">Solve</button>' +
//         '</pre>' +
//         '</div>' +
//         '</div>';
// }

// function accordionListener() {
//     var acc = document.getElementsByClassName("accordion");
//     for (let i = 0; i < acc.length; i++) {
//         acc[i].addEventListener("click", function () {
//             this.classList.toggle("active");
//             var panel = this.nextElementSibling;
//             if (panel.style.display === "block") {
//                 panel.style.display = "none";
//             } else {
//                 panel.style.display = "block";
//             }
//         });
//     }
// }


$(document).on("click", ".naccs .menu div", function() {
	var numberIndex = $(this).index();
	if (!$(this).is("active")) {
		$(".naccs .menu div").removeClass("active");
		$(".naccs ul li").removeClass("active");
		$(this).addClass("active");
		$(".naccs ul").find("li:eq(" + numberIndex + ")").addClass("active");
		var listItemHeight = $(".naccs ul")
			.find("li:eq(" + numberIndex + ")")
			.innerHeight();
		$(".naccs ul").height(listItemHeight + "px");
	}
});
