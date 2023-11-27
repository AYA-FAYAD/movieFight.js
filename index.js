const URL = 'https://www.omdbapi.com/'




// make obj to use cod in both search
const autocompleteConfig = {
  
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    return `
    <img src="${imgSrc}" />
     ${movie.Title} (${movie.Year})
    `
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get(URL, {
      params: {
        apikey: '4f03ed78',
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }

    
    return response.data.Search;
  }

};

createAutoComplet({
  // ... mean make copy from autocompleteConfig
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'), 
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'),'left');
  }
  
  
});

createAutoComplet({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomlete'),

  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'),'right');
  }
  
  
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement,side) => {
    const response = await axios.get(URL, {
        params: {
            apikey: '4f03ed78',
            i: movie.imdbID
        }
    });
  summaryElement.innerHTML = movieTemplet(response.data);
 
  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }


};      

const runComparison = () => {
  const leftSideStat = document.querySelectorAll('#left-summary .notification');
  const rightSideStat = document.querySelectorAll('#right-summary .notification');
  
  leftSideStat.forEach((leftStat, index) => {
    const rigtStat = rightSideStat[index];

    // console.log(leftStat, rigtStat)

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue =  parseInt(rigtStat.dataset.value);

    if (rightSideValue < leftSideValue) {
      leftStat.classList.remove('is-danger');
      leftStat.classList.add('is-success');
    

    } else if (rightSideValue === leftSideValue) {
      // leftStat.classList.remove('is-danger');
      // leftStat.classList.add('is-success');
      // rigtStat.classList.remove('is-danger');
      // rigtStat.classList.add('is-success');

    }
    else {
      rigtStat.classList.remove('is-danger');
      rigtStat.classList.add('is-success');

    }


  })
}

const movieTemplet = (movieDetail) => {
//  (\) mean treat $ as latter g,global
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascore = parseInt(movieDetail.Metascore);
  // parseFolat to keep (,)
  const imdbScore = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  
  // let count = 0; forEach
  const awards = movieDetail.Awards.split(' ').reduce((prev,word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev+ value ;
    }
  }, 0);

  
  
  


 return ` 
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>


    <article data-value=${awards} class="notification is-danger">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification is-danger">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-danger">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>

    <article  data-value=${imdbScore} class="notification is-danger">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
    </article>
    
    <article data-value=${imdbVotes} class="notification is-danger">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
    </article>

  `
}

