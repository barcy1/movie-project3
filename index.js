const mainEl= document.querySelector('main');
const searchInput=document.querySelector('#search-input');
const searchBtn=document.querySelector('#search-btn');
let movies=[];
let watchList=[];
let searched=false;


//event listener for the searchbar enter key:
searchInput.addEventListener('keydown',(event) =>{
    if(event.key==='Enter'){
        console.log('hi');
        event.preventDefault();
        searchBtn.click();// will triger the submit the submit button
    }
});

//add event listener to the doc and check condition by elements id
document.addEventListener('click',(event) =>{
    if(event.target.id === 'search-btn'){
        event.preventDefault();
        startSearch();
    }

    if(event.target.dataset.plus){// if the dataset property is 'plus' (after the data-)        
        let movie=movies.find(movieData => movieData.imdbID === event.target.dataset.plus); // if there is a movie with the 
        //same ID as the element that was triggered (the add to watch list container- I set the dataset according to the boolean)
        // movie will be define to be the first element-a movie element that answer this condition. 
        watchList=JSON.parse(localStorage.getItem('watchlist') || '[]');// now I set the watchList array to get the item from the localStorage
                                                    // or to be an empty array -BOTH OF THEN NEEDS TO BE PARSED TO JS FILE. 
        watchList.push(movie); // pushing the movie item I got from the movies to watchList array wich is the array that was store in the 
                                // localStorage or an empty array
        localStorage.setItem('watchlist',JSON.stringify(watchList));// adding the updated watchlist moevie array to the locaStorage.
                                         // and saving it there so even if the watchList array get intiated it wont effect the local storage.
                                         //HERE AND ON THE MINUS EVENT IS THE ONLY PLACES THE LOCAL STORAGE GETS UPDATE.
    }

    if(event.target.dataset.minus){// if the dataset property is 'minus' (after the data-)  
        watchList=JSON.parse(localStorage.getItem('watchlist') || '[]');
        watchList=watchList.filter(movie => movie.imdbID !== event.target.dataset.minus ); // I finter the watchList array and set it to be only the items
                        // that answer the condition- meaning I keep all the items wich their imdbID is not the imdbID of the items with 
                        // minus. so each movie imdbId that have dataset of minus will be throwen from the arrayl
        
       
        localStorage.setItem('watchlist', JSON.stringify(watchList)); // saving the new filtered array to localStorage.
        
        if(watchList.length>0){
            setHtml(watchList, false); // if the watchList array is not empty call the setHtml function and pass it the watchList array and
                                        // the boolean value of false- so its display only the dataset minus item.
        }
        else{
            renderWatchlistPlaceholder();
        }
        
    }

});

//functions:

const startSearch= async function(){
    
    console.log('hi there');
    const res=await fetch(`http://www.omdbapi.com/?s=${searchInput.value}&apikey=39fdc95`);
    const moviesByName= await res.json();
    
         movies=[];

    if(moviesByName.Response){
        for(movie of moviesByName.Search){     
            const response= await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=39fdc95`);
            const moviesById= await response.json();
            movies.push(moviesById);           
        }       
        if(movies.length>0){        
            setHtml(movies,true); // true will be passed as pkusOrMinus to see what kind of button to display!
        }
    } 
}


const setHtml= function(movies,plusOrMinus){
    
     mainEl.innerHTML= ` ${movies.map(movie => getHtml(movie,plusOrMinus)).join('')} `     
     
      
}

const getHtml= function(movie,plusOrMinus){ 
    //console.log(movie.Title);   
      return(`<div class='movie-card-grid'>
                    <div class="movie-logo-container">
                    <img src="${movie.Poster}" alt="alti">
                    </div>
                    <div class="card-details">
                        <div class="card-title">
                            <h2>${movie.Title}</h2>
                            <img src="./icons/star-icon.png" alt="icon">
                            <p>${movie.imdbRating}</p>
                        </div>
                        <div class="movie-details">
                            <div class="par"> <p>${movie.Runtime}</p></div>
                            <div class=" par1"><p> ${movie.Genre}</p></div>
                            ${getButton(movie, plusOrMinus)}
                        </div>
                        <div class="discription-container">
                            <p>${movie.Plot} </p>
                        </div>
                       
                    
                    </div>
                </div>
            
                <hr /> 
        
        `
    )  
}

const getButton= (movie, plus) =>{ // intiate the button to a plus sign
    if(plus){        
         return(
            `<div  class='containerr'>
                <img data-plus='${movie.imdbID}' src='./icons/plus-icon.png'>
                <p data-plus='${movie.imdbID}'>add to watchlist </p>
            </div>`
        ) 
    }
    else{
        return(`<div class='containerr' >
            <img data-minus='${movie.imdbID}' src='./icons/minus-icon.png'>
            <p data-minus='${movie.imdbID}'> remove from watchlist </p>
        </div>`

        )
    }  
   
        
}

const renderPlaceholder = () => {
    mainEl.innerHTML = `       
            <div class='center-section'>
                <img src="./icons/film-icon.png">
                <div class="placeholder">Start exploring</div>
            </div>
        `
}
const renderWatchlistPlaceholder = () => {
    mainEl.innerHTML = `
    
        <div class="watchlist-placeholder">
            <div >Your watchlist is looking a little empty...</div>
            <div class='containerr'>
                <a href='index.html'>
                    <img src='./icons/plus-icon.png'> 
                    <p class='more-movies'> Let search some movie to add! </p>                    
                </a>
            </div>
        </div>
    `
}

if(mainEl.id==='index' && !searched){
    renderPlaceholder();
}else{
    watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    console.log(watchlist)
    if(watchlist.length > 0) {
        setHtml(watchlist, false)
    }
    else {
        renderWatchlistPlaceholder()
    }

}



 


/* <div>
<div class="movie-card-grid">
    <div class="movie-logo-container">
        <img src="${movie.Poster}" alt="alti">
    </div>
    <div class="card-details">
        <div class="card-title">
            <h2>${movie.Title}</h2>
            <img src="./icons/star-icon.png" alt="icon">
            <p>8.1</p>
        </div>
        <div class="movie-details">
            <div class="par"> <p>${movie.RunTime}</p></div>
            <div class="par"><p> ${movie.Genre}</p></div>                    
            ${getButton(movie, plusOrMinus)}
        <div class="discription-container">
            <p>${movie.Plot} </p>
        </div>
    </div>
</div>
<hr /> 
</div>  */  
