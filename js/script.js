const APIKEY = 'c4922be9712d4270af3931bb9b237467';
const URLBASE = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json';

$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $("#searchText").val();
    getMovies(searchText);
    e.preventDefault();

  });
});

function getMovies(searchText){
  let url = URLBASE + '?' + $.param({
    'api-key': APIKEY,
    'query': searchText
  });

  $.ajax({
    url: url,
    method: 'GET',
  }).done((response) => {
    let movies = response.results;
    console.log(response.results);

    let htmlResult = '';

    var sortedMovies = movies.sort((a,b) => {
      let dateA = new Date(a.opening_date);
      let dateB = new Date(b.opening_date);
      
      if(dateA > dateB){
        return 1;
      }
      if(dateA < dateB){
        return -1;
      }
      if(dateA == dateB){
        return 0;
      }
    });

    $.each(sortedMovies, (index, movie) => {
      htmlResult += `
        <div class="col-md-3">
          <div class="well">
            <h4>${movie.display_title}</h4>
            <h5>${movie.opening_date != null ? movie.opening_date : ''}</h5>
            <img src="${movie.multimedia != null ? movie.multimedia.src : ''}"/>
          </div>
        </div>
      `;
    });

    $('#movies-container').html(htmlResult);

  }).fail((err) => {
    throw err;
  });
}

/*
{
  "status": "OK",
  "copyright": "Copyright (c) 2017 The New York Times Company. All Rights Reserved.",
  "has_more": false,
  "num_results": 1,
  "results": [
    {
      "display_title": "Rogue One: A Star Wars Story",
      "mpaa_rating": "PG-13",
      "critics_pick": 0,
      "byline": "A. O. SCOTT",
      "headline": "Review: ‘Rogue One’ Leaves ‘Star Wars’ Fans Wanting More and Less",
      "summary_short": "This film, masquerading as a heroic tale of rebellion, falls short of the insurgent energy of its predecessors in the franchise.",
      "publication_date": "2016-12-13",
      "opening_date": "2016-12-16",
      "date_updated": "2017-01-13 17:44:02",
      "link": {
        "type": "article",
        "url": "http://www.nytimes.com/2016/12/13/movies/star-wars-rogue-one-review.html",
        "suggested_link_text": "Read the New York Times Review of Rogue One: A Star Wars Story"
      },
      "multimedia": {
        "type": "mediumThreeByTwo210",
        "src": "https://static01.nyt.com/images/2016/12/14/arts/14ROGUEONE1/14ROGUEONE1-mediumThreeByTwo210.jpg",
        "width": 210,
        "height": 140
      }
    }
  ]
}
*/