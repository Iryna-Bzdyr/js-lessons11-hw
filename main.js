
const searchForm = document.forms['search']
console.log(searchForm.length)
const getId = id => document.getElementById(id);
let data
let dataPage
let movieAbout
let moviesBox = []
moviesBox = document.querySelectorAll('.movie-wrapper')
let moviesAboutBox = document.querySelectorAll('.movie-about')[0]

searchForm[0].addEventListener('change',function(){
    getId('inputClick').style.display = 'block'
})

getId('inputClick').addEventListener('click',function(){
    searchForm[0].value = ''
    getId('inputClick').style.display = 'none' 
})

searchForm.searchBtn.onclick = function () {
    getId('movies').style.display = 'block'
    let xml = new XMLHttpRequest();
    xml.open('GET', `http://www.omdbapi.com/?s=${searchForm[0].value}&page=1&apikey=eeb56d4b`, false);
    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && xml.status == 200) {
            data = JSON.parse(xml.responseText)
            console.log(data)
            if (data.Response == "False") {
                console.log(data.Error)
                getId('movies').style.display = 'none'
                getId('error').style.display='block'
                getId('error').innerHTML = data.Error

            }
            else {
                getId('error').style.display='none'
                function moviesInner(item, index, array) {
                    if (data.Search[index].Poster == 'N/A' || xml.status == 400) {
                        moviesBox[index].children[0].innerHTML = `<img src="https://us.123rf.com/450wm/natrot/natrot1608/natrot160800071/60724066-resumen-de-fondo-negro-vector.jpg?ver=6" alt="">`
                    }
                    else {
                        moviesBox[index].children[0].innerHTML = `<img src="${data.Search[index].Poster}" alt="">`
                    }

                    moviesBox[index].children[1].innerHTML = data.Search[index].Title
                    moviesBox[index].children[2].innerHTML = data.Search[index].Type
                    moviesBox[index].children[3].innerHTML = data.Search[index].Year
                    let pagesCount = Math.ceil(data.totalResults / 10)
                    let pagesArray = []
                    for (let i = 0; i <= pagesCount; i++) {
                        pagesArray.push(i)

                    }

                    let pageBtns
                    for (let i = 0; i < pagesCount; i++) {
                        pageBtns += `<button class="page-btns" type="button">` + pagesArray[i + 1] + '</button>'

                    }
                    getId('pages-block').innerHTML = pageBtns
                    let pages = document.querySelectorAll('.page-btns')
                    function resivePage(button, index, array) {
                        button.addEventListener('click', function () {
                            xml = new XMLHttpRequest();
                            xml.open('GET', `http://www.omdbapi.com/?s=${searchForm[0].value}&page=${index + 1}&apikey=eeb56d4b`, false);
                            xml.onreadystatechange = function () {
                                if (xml.readyState == 4 && xml.status == 200) {
                                    data = JSON.parse(xml.responseText)
                                }

                            }

                            xml.send();
                            moviesBox.forEach(moviesInner);
                        })
                    }
                    pages.forEach(resivePage)
                    moviesBox[index].children[4].onclick = function () {
                        document.querySelectorAll('.second')[0].style.display = 'block'
                        document.querySelectorAll('.main')[0].style.opacity = 0.3
                        document.body.style.backgroundColor = 'rgb(213, 215, 216)'
                        console.log(data.Search[index].Title)
                        xml = new XMLHttpRequest();
                        xml.open('GET', `http://www.omdbapi.com/?t=${data.Search[index].Title}&apikey=eeb56d4b`, false);
                        xml.onreadystatechange = function () {
                            if (xml.readyState == 4 && xml.status == 200) {
                                movieAbout = JSON.parse(xml.responseText)
                                console.log(movieAbout);
                                if (movieAbout.Poster == 'N/A' || xml.status == 400) {
                                    getId('movie-about-poster').innerHTML = `<img src="https://us.123rf.com/450wm/natrot/natrot1608/natrot160800071/60724066-resumen-de-fondo-negro-vector.jpg?ver=6" class="poster">`
                                }
                                else {
                                    getId('movie-about-poster').innerHTML = `<img src="${movieAbout.Poster}" alt="">`
                                }
                                let movieAboutElements = [movieAbout.Title, movieAbout.Rated, movieAbout.Plot, movieAbout.Writer, movieAbout.Director, movieAbout.Actors, movieAbout.BoxOffice, movieAbout.Awards, movieAbout.Ratings]
                                console.log(movieAboutElements)
                                for (let i = 0; i < moviesAboutBox.children.length - 1; i++) {
                                    moviesAboutBox.children[i].innerHTML = moviesAboutBox.children[i].innerHTML + movieAboutElements[i]
                                }
                                let movieRatings = []
                                movieRatings = movieAboutElements[8]
                                console.log(movieRatings)
                                let ratings

                                for (let i = 0; i < movieRatings.length; i++) {
                                    ratings += `<p>${movieRatings[i].Source}:  ${movieRatings[i].Value} </p>`
                                }
                                moviesAboutBox.children[8].innerHTML = moviesAboutBox.children[8].innerHTML + ratings
                            }

                        }

                        xml.send();
                    }

                    getId('click').addEventListener('click', function () {
                        document.querySelectorAll('.second')[0].style.display = 'none'
                        document.querySelectorAll('.main')[0].style.opacity = 1
                        document.body.style.backgroundColor = 'transparent'
                        for (let i = 0; i < moviesAboutBox.children.length; i++) {
                            moviesAboutBox.children[i].innerHTML = ''
                        }
                        moviesAboutBox.children[3].innerHTML = '<span>Written by: </span>'
                        moviesAboutBox.children[4].innerHTML = '<span>Directed by: </span>'
                        moviesAboutBox.children[5].innerHTML = '<span>Starring: </span>'
                        moviesAboutBox.children[6].innerHTML = '<span>BoxOffice: </span>'
                        moviesAboutBox.children[7].innerHTML = '<span>Awards: </span>'
                        moviesAboutBox.children[8].innerHTML = '<span>Ratings: </span>'

                    })
                }
                moviesBox.forEach(moviesInner);
            }
        }
    }
    xml.send();
}

