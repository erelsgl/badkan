var loadImage = function  (e) {
	alert('reloading image '+ e.target.src);
	e.target.src = window.location.protocol + "//" + window.location.hostname + ':8010' + e.target.src); 
};
function addEventListenerOnce(target, type, listener, addOptions, removeOptions) {
    target.addEventListener(type, function fn(event) {
        target.removeEventListener(type, fn, removeOptions);
        listener.apply(this, arguments, addOptions);
    });
}
var classname = document.getElementsByClassName("img");
for (var i = 0; i < classname.length; i++) {
    addEventListenerOnce(classname[i],'click',loadImage);
    //classname[i].addEventListener('load', loadImage, false);
    //classname[i].addEventListener('click', loadImage, false);
}
