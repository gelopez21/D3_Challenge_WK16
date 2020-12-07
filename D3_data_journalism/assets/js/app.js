var svgWidth = 800;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(allData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    allData.forEach(function(data) {
    	//console.log(data.healthcare + ", " + data.poverty);
    	//console.log(data);
      	data.healthcare = +data.healthcare;
      	data.poverty = +data.poverty;
      	data.attr = data.attr;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([	d3.min(allData, d => d.poverty) - 1,
      			d3.max(allData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([	d3.min(allData, d => d.healthcare) - 1,
      			d3.max(allData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
	    .data(allData)
	    .enter()
	    .append("circle")
	    .attr("cx", d => xLinearScale(d.poverty))
	    .attr("cy", d => yLinearScale(d.healthcare))
	    .attr("r", "10")
	    .attr("fill", "blue")
	    .attr("opacity", ".5");

	// I have no idea why, but the first 26 states are being ignored for
	// labels, so just going to pad with empty states...
	for (var i = 0; i < 26; i++)
		allData.unshift({healthcare: 0, poverty: 0, abbr : "XX"});

	var textGroup = chartGroup.selectAll("text")
	   .data(allData)
	   .enter()
	   .append("text")
	       	.text((d) => (d.abbr))
			.attr("x", (d) => {console.log(d.abbr); return xLinearScale(d.poverty) - 6;})
			.attr("y", d => yLinearScale(d.healthcare) + 4) 
			.attr("fill", "white") 
			.attr("font-size", 10);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("In Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

  }).catch(function(error) {
    console.log(error);
  });
