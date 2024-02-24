function showCountryTitle(element, event) {
  var title = element.getAttribute('title');
  var tooltip = document.getElementById('tooltip');
  tooltip.innerText = title;
  tooltip.style.display = 'block';
  tooltip.style.left = (event.pageX + 10) + 'px'; 
  tooltip.style.top = (event.pageY - tooltipRect.height - 10) + 'px';
  
}

document.addEventListener('click', function(event) {
  if (event.target.tagName === 'path') {
    showCountryTitle(event.target, event);
  }
});

document.addEventListener('mouseleave', function() {
  var tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
});

