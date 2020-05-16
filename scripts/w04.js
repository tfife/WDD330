//Mobile drag and drop

let starMobile = document.getElementById('starMobile');

starMobile.addEventListener('touchmove', function(ev) {
    ev.preventDefault()
    let touchLocation = ev.targetTouches[0]
    starMobile.style.left = (touchLocation.pageX - 35) + 'px'
    starMobile.style.top = (touchLocation.pageY - 35) + 'px'
    
})


// Desktop drag and drop

function allowDrop(ev) {
    ev.preventDefault();
  }
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}