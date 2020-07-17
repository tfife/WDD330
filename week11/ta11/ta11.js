import { makeRequest } from "../ta11/authHelpers.js"
import { Auth } from "../ta11/auth.js"


window.onload = function () {
    showNav(2)
}

let auth = new Auth()


gsap.from('#login', { scale: 0, duration: 3, rotate: 900, ease: "elastic" })
gsap.from('#button', { duration: 2, y: 1000, ease: "bounce" })
gsap.from('#username', { duration: 5, skewX: 45, opacity: 0, rotate: 360, ease: "bounce" })

document.getElementById("button").addEventListener("click", () => {
    console.log("BUTTON")

    let token = auth.login()
    console.log(token)
})