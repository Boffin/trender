var Trender = function (options) {
	var _options = options;
};

// Data accessors
var x = function (d) {
	return d.income;
};
var y = function (d) {
	return d.lifeExpectancy;
};
var radius = function (d) {
	return d.population;
};
var color = function (d) {
	return d.region
};
var key = function (d) {
	return d.name;
};


$(document).ready(function () {
	var $canvas = $('#canvas'),
		margin = 15,
		width = $canvas.width() - 2*margin,
		height = $canvas.height() - 2*margin;

	var xScale = d3.scale.log().domain([100, 1e5]).range([0, width]),
		yScale = d3.scale.linear().domain([10, 100]).range([height, 0]),
		radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([10, 50]),
		colorScale = d3.scale.category10();

	var xAxis = d3.svg.axis().orient('bottom').scale(xScale).ticks(12, d3.format(",d")),
		yAxis = d3.svg.axis().orient('left').scale(yScale);

	var svg = d3.select('#canvas').append('svg')
		.attr('width', width + 2 * margin)
		.attr('height', height + 2 * margin)
		.append('g')
		.attr('transform', 'translate(25, 5)');

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0, ' + height + ')')
		.call(xAxis);
	svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis);


	// Axis labels
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height - 6)
		.text("income per capita, inflation-adjusted (dollars)");

	svg.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("y", 6)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("life expectancy (years)");


	// Add the year label; the value is set on transition.
	var label = svg.append("text")
		.attr("class", "year label")
		.attr("text-anchor", "end")
		.attr("y", height - 24)
		.attr("x", width)
		.text(1800);


	d3.json('nations.json', function (nations) {
		window.nations = nations;

		var bisect = d3.bisector(function (d) {
			return d[0];
		});

		var interpolateValues = function (values, year) {
			var i = bisect.left(values, year, 0, values.length - 1),
				a = values[i];
			if (i > 0) {
				var b = values[i - 1],
					t = (year - a[0]) / (b[0] - a[0]);
				return a[1] * (1 - t) + b[1] * t;
			}
			return a[1];
		};

		var interpolateData = function (year) {
			return nations.map(function (d) {
				return {
					name: d.name,
					region: d.region,
					income: interpolateValues(d.income, year),
					population: interpolateValues(d.population, year),
					lifeExpectancy: interpolateValues(d.lifeExpectancy, year)
				}
			});
		};

		var position = function (dot) {
			return dot
				.attr("cx", function (d) {
					console.log(xScale(x(d)));
					return xScale(x(d));
				})
				.attr('cy', function (d) {
					return yScale(y(d));
				})
				.attr('r', function (d) {
					return radiusScale(radius(d))
				});
		};
		var order = function(a, b) {
			return radius(a) - radius(b);
		};

		var tweenYear = function() {
			var year = d3.interpolateNumber(1800, 2009);
			return function (t) {
				displayYear(year(t));
			};
		};

		// Updates the display to show the specified year.
		var displayYear = function (year) {
			dot.data(interpolateData(year), key).call(position).sort(order);
			label.text(Math.round(year));
		};

		var dot = svg.append('g')
			.attr('class', 'dots')
			.selectAll('.dot')
			.data(interpolateData(1800))
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.style('fill', function (d) {
				return colorScale(color(d));
			})
			.call(position)
			.sort(order);
		dot.append('title').text(key);
		
		svg.transition()
			.duration(30000)
			.ease('linear')
			.tween('year', tweenYear);
	});
});