var sortedArrays = {};
var textForm = {};

function initializeSimilarityEngine(rawData){

	sortedArrays['average rating'] = sortArrayByUnit(rawData.slice(), 'average rating');
    sortedArrays['imdb rating'] = sortArrayByUnit(rawData.slice(), 'imdb rating');
    sortedArrays['metascore'] = sortArrayByUnit(rawData.slice(), 'metascore');
    sortedArrays['# award nominations'] = sortArrayByUnit(rawData.slice(), '# award nominations');
    sortedArrays['# award wins'] = sortArrayByUnit(rawData.slice(), '# award wins');
    sortedArrays['gross ($)'] = sortArrayByUnit(rawData.slice(), 'gross ($)');

    textForm['average rating'] = 'Average Ratings';
    textForm['imdb rating'] = 'IMDB Ratings';
    textForm['metascore'] = 'Metascores';
    textForm['# award nominations'] = '# Award Nominations';
    textForm['# award wins'] = '# Award Wins';
    textForm['gross ($)'] = 'Revenues ($)';

	console.dir(sortedArrays);
}

function sortArrayByUnit(array, unit){
	array.sort(function(a,b){return a[unit]-b[unit];});
	return array;
}


function similarityTitle(){
    return textForm[yAxisUnit] +" for Movies with Similar "+textForm[xAxisUnit];
}

function getKSimilarMovies(movie, unit, k){
	var kClosest = getKclosest(sortedArrays[unit], movie, k, sortedArrays[unit].length, 'average rating');
    //console.log(kClosest);
    return kClosest;
}

function formattedSimilarMovies(movie, unit, displayUnit, k){
	similarMovies = getKSimilarMovies(movie, unit, k);

	var formattedSimilarMovies = [];
	formattedSimilarMovies.push({'text': movie['title'], 'count': movie[displayUnit], 'imdb_id': movie['imdb_id']});
	similarMovies.forEach(function(movie){
		var movieInfo = {};
		movieInfo['text'] = movie.title;
		movieInfo['count'] = String(movie[displayUnit]);
		movieInfo['imdb_id'] = movie['imdb_id'];
		formattedSimilarMovies.push(movieInfo);
	})
	return formattedSimilarMovies;
}

function crossOverPoint(a, l  , h , x, unit)
     {

         if(l>h)
             return -1;

         if(a[h][unit]<=x[unit])
             return h;

         if(x[unit]<a[l][unit])
             return l;


         mid = Math.floor(l + (h-l)/2);

         if(a[mid][unit]<=x[unit] && a[mid+1][unit]>x[unit])
         {
             return mid;
         }
         if(a[mid][unit]<=x[unit])
         {
             return crossOverPoint(a, mid+1, h, x, unit);
         }
         else
         {
            return crossOverPoint(a,l, mid-1, x, unit);
         }
     }

// This function prints k closest elements to x in arr[].
// n is the number of elements in arr[]
function getKclosest(arr, x, k, n, unit)
{
    // Find the crossover point
    var similarMovies = [];
    var l = crossOverPoint(arr, 0, n-1, x, unit);
    console.log(l);
    var r = l+1;   // Right index to search
    var count = 0; // To keep track of count of elements already printed

    // If x is present in arr[], then reduce left index
    // Assumption: all elements in arr[] are distinct
    if (arr[l] == x) l--;

    // Compare elements on left and right of crossover
    // point to find the k closest elements
    while (l >= 0 && r < n && count < k)
    {
        if (x[unit] - arr[l][unit] < arr[r][unit] - x[unit])
            similarMovies.push(arr[l--]);
        else
            similarMovies.push(arr[r++]);
        count++;
    }

    // If there are no more elements on right side, then
    // print left elements
    while (count < k && l >= 0)
        similarMovies.push(arr[l--]), count++;

    // If there are no more elements on left side, then
    // print right elements
    while (count < k && r < n)
        similarMovies.push(arr[r++]), count++;

    return similarMovies;
}
