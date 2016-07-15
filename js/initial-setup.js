$(document).ready(function(){
	initializeGraph();
	$('select').material_select();
});

window.margin = {top: 50, right: 60, bottom: 30, left: 30};
window.width = 600 - margin.left - margin.right;
window.height = 550 - margin.top - margin.bottom;
window.selectedMovie = "";

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.direction('e')
	.html(function(d) {
		return "<div class='center'><span style='font-size:30px'>" + d.title + " (" + d.year+ ")</span><br /><br />"+
				"<strong>Avg Rating: </strong><span style='color:lightblue'> " + d['average rating'] + "/5</span><br />"+
				"<strong>IMDB Rating: </strong><span style='color:lightblue'> " + d['imdb rating'] + "/10</span><br />"+
				"<strong>Metascore Rating: </strong><span style='color:lightblue'> " + d['metascore'] + "/100</span><br />"+
				"<strong>Revenue: </strong><span style='color:#19C800'>" + formatDollar(d["gross ($)"]) + "</span><br />"+
				"<strong># Award Wins: </strong><span style='color:red'> " + d['# award wins'] + "</span><br />"+
				"<strong># Award Nominations: </strong><span style='color:yellow'> " + d['# award nominations'] + "</span></div><br />";

	});

console.log("added tooltip");

//function for bringing current year to the front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};

function formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return "$" + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
}

function initializeGraph(){

	window.yAxisUnit = "# award nominations";
	window.xAxisUnit = "average rating";
	var year = document.getElementById('year');

	window.svg = d3.select("#graph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);


	window.xScale = d3.scale.linear().range([0, width]);
	window.yScale = d3.scale.linear().range([height, 0]);


	d3.csv("movies_edited.csv", function(error,data1){

		window.data = [];
		var lg = new Set(); // this is the list of genres we will be using

		data1.forEach(function(d){
			if (d.genres != ""){
					d.genres.split("|").forEach(function(g){
						lg.add(g);
					})
				}
			if(!isNaN(Number(d["gross ($)"])) && Number(d["gross ($)"]) >= 100000 && d['average rating'] >= 0 && d.metascore >= 0 && d['imdb rating'] >= 0 && Number(d['imdb link']) >= 0){
				data.push({"movieId": d.movieId, "title": d.title, "year": d.year, "gross ($)": +d["gross ($)"],
				'average rating': +d["average rating"], 'imdb rating': +d['imdb rating'], 'metascore': +d['metascore'],
				 'genres': d.genres.split('|'),'imdb_id': "tt" + d['imdb link'], '# award nominations': +d['# award nominations'], "# award wins": +d["# award wins"]});
			}
		})


		initializeSimilarityEngine(data);
		$("#movieName").html(similarityTitle());


		var xAxis = createXAxis(data, xScale, xAxisUnit);
		var yAxis = createYAxis(data, yScale, yAxisUnit);


		svg.append('g')
			.attr("class", "x axis")
			.attr("fill", "white")
			.attr("width", 2)
			.attr("transform", "translate("+margin.left+","+height+")")
			.call(xAxis)
			.append("text")
		      .attr("class", "label")
		      .attr("x", width+30)
		      .attr("y", -6)
		      .style("text-anchor", "end")
		      .text("Average Rating");

		svg.append('g')
			.attr("class", "y axis")
			.attr("fill", "white")
			.attr("transform", "translate("+margin.left+",0)")
			.call(yAxis)
				.append("text")
			    .attr("class", "label")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text(yAxisUnit);

		svg.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","dot")
			.attr("r", 4)
			.attr("fill", function(d){
				var contained = "gray";
				if (d.year == year.value){
					//console.log(this);
					//d3.select(this).moveToFront();
					if(selectedGenres.length == 0)
						return "red";
					else{
						d.genres.forEach(function(genre){
							if(selectedGenres.indexOf(genre) != -1){
								contained = "red";
								return 0;
							}
						});
						return contained;
					}
				}
				else
					return backgroundColor;
				})
			.attr("opacity", function(d){
				if (d.year == year.value){
					// d3.select(this).moveToFront();
					return 1;
				}
				else
					return 0.1;
			})
			// .attr("stroke", function(d){
			// 	if (d['golden globe'] > 0 && d['# oscar nominations'] > 0){
			// 		return "yellow";
			// 	}
			// })
			// .attr("stroke-width", function(d){
			// 	if (d['golden globe'] > 0 && d['# oscar nominations'] > 0){
			// 		return 2;
			// 	}
			// })
			.attr("cx", function(d){return xScale(d[xAxisUnit]) + margin.left;})
			.attr("cy", function(d){return yScale(d[yAxisUnit]) - 6;})
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
			.on("click", function(d){
				// // setting up framework for second view
				selectedMovie = d;
				newBubbleChart(formattedSimilarMovies(d, xAxisUnit, yAxisUnit, 4));
				console.log("graph clicked");
			});

		createGenreChecklist(lg);

	})

	console.log('graph initialized');
}

function createGenreChecklist(lg){
	lg.forEach(function(d){
		$('#genre-container').append("<input class = 'genre-checkbox' type='checkbox' value = '"+d+"' id='genre"+d+"' onclick = 'checkboxClicked()'/><label  class='padCheckbox' for='genre"+d+"'>"+d+"</label>");
		//console.log('appended genre ' + d);
	})
	$('#genre-container').append("<input id = 'select-all' class ='' type='checkbox' onclick='selectAll(this)'><label class='padCheckbox' for='select-all'>Reset Selection</label></input>");
}

// Color for each circle
function colorCircles(id, color1, color2){
    var grad = svg.append("defs")
        .append("linearGradient").attr("id", "grad" + id)
        .attr("x1", "100%").attr("x2", "0%").attr("y1", "0%").attr("y2", "0%");
    grad.append("stop").attr("offset", "50%").style("stop-color", color1);
    grad.append("stop").attr("offset", "50%").style("stop-color", color2);
}
