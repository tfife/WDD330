const toggleMenuVisibility = () => {
    document.querySelector('#navigation').classList.toggle('visible')
}

document.querySelector('#menuButton').addEventListener('click', toggleMenuVisibility)