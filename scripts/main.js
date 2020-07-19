const toggleMenuVisibility = () => {
    document.querySelector('#navigation').classList.toggle('visible')
}

function showNav(depth) {

    let pathPrefix = ''
    for (i = 0; i < depth; i++) {
        console.log('step')
        pathPrefix = pathPrefix + '../'
    }
    console.log(pathPrefix)
    console.log(depth)
    console.log(parseInt(depth))

    document.querySelector('#nav').innerHTML = 
    `
    <ul id='navigation'>
            <li><a href='#menu' id='menuButton'>Menu &equiv;</a></li>
            <li><a href='${pathPrefix}week01'>Week 01 - Introduction to the Course</a></li>
            <li><a href='${pathPrefix}week02'>Week 02 - Review of the Basics</a></li>
            <li><a href='${pathPrefix}week03'>Week 03 - Objects and Arrays</a></li>
            <li><a href='${pathPrefix}week04'>Week 04 - Forms</a></li>
            <li><a href='${pathPrefix}week05'>Week 05 - Debugging</a></li>
            <li><a href='${pathPrefix}week06'>Week 06 - Todo App</a></li>
            <li><a href='${pathPrefix}week07'>Week 07 - Functions and Ajax</a></li>
            <li><a href='${pathPrefix}week08'>Week 08 - Transitions and Other Exciting Stuff</a></li>
            <li><a href='${pathPrefix}week09'>Week 09 - Window and APIs</a></li>
            <li><a href='${pathPrefix}week10'>Week 10 - Validating Forms and Fetch</a></li>
            <li><a href='${pathPrefix}week11'>Week 11</a></li>
            <li><a href='${pathPrefix}minesweeper'>Minesweeper</a></li>
        </ul>
    `
        
    document.querySelector('#menuButton').addEventListener('click', toggleMenuVisibility)
}