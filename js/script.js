var link = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"; //link to JSON data

var parseTime = d3.timeParse("%M:%S"); //parse time from JSON
var parseYear = d3.timeParse("%Y"); //parse years from JSON
var color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(0, 9)); //color schemes
var chartDiv = document.getElementById("container");
var width = 900;
var height = 600;
var margin = {
    top: 50,
    bottom: 60,
    left: 60,
    right: 20
}; //margins 

var svg = d3.select('#container')
    .append('svg')
    .classed("svg-content", true)
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right) 

var chart = svg
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var formatTime = d3.timeFormat("%M:%S"); //parsed time back to string
var formatYear = d3.timeFormat("%Y");

d3.json(link).then(function (data) { //get JSON data

    //parse the selected data (Time and Year)
    data.forEach(function (d) {
        d.Time = parseTime(d.Time);
        d.Year = parseYear(d.Year);
    })
    //grab the minimum and max years to use to format data and for scale in graph
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return d.Year
        }))
        .range([0, width]);
    //create array of just the time values 
    var y = data.map(function (d) {
        return d.Time
    })
    //max and min y values
    var max = d3.max(y);
    var min = d3.min(y);
    //grab the min and max time values
    const yScale = d3.scaleTime()
        .domain([min.setSeconds(Math.floor(min.getSeconds())), max.setSeconds(Math.ceil(max.getSeconds() + 10))].reverse())
        .range([height, 0]);


    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .ticks(20)
    }

    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(10)
    }

    svg.append("text")
        .attr("id", "title")
        .style("text-anchor", "beginning")
        .attr("x", 350)
        .attr("y", 30)
        .attr("font-size", "2em")
        .text("Doping Scandals in Cycling")

    chart.append("text")
        .attr("id", "caption")
        .attr("y", -width)
        .attr("font-size", "3em")
        .text("Times at the Alpe d'Huez")

    chart.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    chart.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    chart.append('g')
        .attr('transform', "translate(0, " + height + ")")
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale));

    chart.append("text")
        .attr("x", width)
        .attr("y", height)
        .style("text-anchor", "end")
        .text("Year");

    chart.append('g')
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale)
            .ticks(10)
            .tickFormat(function (d, i) {
                return formatTime(d)
            }));

    //label on left side of chart
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 40)
        .attr("y", -15)
        .style('text-anchor', 'end')
        .text("Minutes")

    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    chart.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(d.Year))
        .attr('cy', (d) => yScale(d.Time))
        .attr('r', 15)
        .attr("fill", function (d) {
            if (d.URL == "") {
                return color(2)
            } else {
                return color(3)
            }
        })
        .on("mouseover", function (d) {
            if (d.URL == "") {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(formatYear(d.Year) + " " + d.Name + "<br/>" + "Time: " + formatTime(d.Time))
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY) + "px");
            } else {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(formatYear(d.Year) + " " + d.Name + "<br/>" + "Time: " + formatTime(d.Time) + "<br/>"
                    + d.Doping)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY) + "px");
            }
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var legendKeys = ["Doping", "Not Doping"];
    var legend = svg.selectAll("legend")
        .data(legendKeys)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + (height / 2 - i * 20) + ")";
        })

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) {
            if (d == "Doping") {
                return color(3)
            } else {
                return color(2)
            }
        })

    legend.append('text')
        .attr("x", width - 24)
        .attr("y", 9)
        .style('text-anchor', "end")
        .text((d) => d)
});