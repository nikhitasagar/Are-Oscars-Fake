//All the functions for creating and re-writing x and y axis

function createYAxis(data, scale, unit){
	scale.domain([d3.min(data, function(d){return d[unit];}), d3.max(data,function(d){return d[unit];})]);
	var yAxis = d3.svg.axis().scale(scale).ticks(5).orient("left");
	console.log('y axis created');
	return yAxis;
}

function createXAxis(data, scale, unit){
	console.log(unit);
	scale.domain([d3.min(data, function(d){return d[unit];}), d3.max(data,function(d){return d[unit];})]);
	var xAxis = d3.svg.axis().scale(scale).ticks(5).orient("bottom");
	console.log('x axis created');
	return xAxis;
}

function rewriteYAxis(unit){
	svg.selectAll('.y.axis').remove();
	yScale.domain([d3.min(data, function(d){return d[unit];}), d3.max(data,function(d){return d[unit];})]);
	var yAxis = createYAxis(data, yScale, unit);

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
			    .text(unit);
	console.log('y axis rewritten');
}

function rewriteXAxis(unit){
	svg.selectAll('.x.axis').remove();
	var xAxis = createXAxis(data, xScale, unit);

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
			      .text(unit);
	console.log('x axis rewritten');
}

function changeDomain(data, scale, unit){
	console.log('domain changed');
}