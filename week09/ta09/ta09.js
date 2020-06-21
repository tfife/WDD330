window.onload = function () {
    showNav(2)
}

document.addEventListener('keydown', function (e) {
    console.log(e.which)

    let audioHTML = document.querySelectorAll("audio")

    audioHTML.forEach(element => {

        if(element.getAttribute("data-key") == e.which) {
            element.load()
            element.play()

            let keys = document.querySelectorAll(".key")

            keys.forEach(key => {
                if(key.getAttribute("data-key") == e.which) {
                    key.classList.add("playing")

                    // let offset = (Number(key.getAttribute("data-offset")) + 10) % 100
                    // key.style.transform = `translateY(${offset}px) rotate(360deg)`
                    // key.setAttribute("data-offset", `${offset}`) 
                    // console.log("offset: " + key.getAttribute("data-offset"))

                    let scale = Number(key.getAttribute("data-offset")) - .5
                    if (scale <= 5) {
                        scale = 10
                    }
                    let rotate = 360 * (11 - (scale - 5) * 2)
                    scale = scale / 10
                   
                    key.style.transform = `scale(${scale}) rotate(${rotate}deg)`
                    key.setAttribute("data-offset", `${scale * 10}` )
                    console.log(scale)
                }
            })

            element.onended = function () {
                keys.forEach(key => {
                    if(key.getAttribute("data-key") == e.which) {
                        key.classList.remove("playing")
                    }
                })
            }
        }
    })
})