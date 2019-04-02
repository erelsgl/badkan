document.getElementById("submit").addEventListener('click', e => {
  const file = document.getElementById('the-file').files[0];
  var formData = new FormData();
  formData.append('file', file);
  var formData = new FormData();
  formData.append('file', file);
  var xhr = new XMLHttpRequest();
  // Add any event handlers here...
  xhr.open('POST', true);
  xhr.send(formData);
});