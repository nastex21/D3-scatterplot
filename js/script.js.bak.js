var link = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var height = 800;
var width = 800;
var margin = {
    top: 50,
    bottom: 60,
    left: 60,
    right: 20
};
var parseTime = d3.timeParse("%M:%S");
var parseYear = d3.timeParse("%Y");
var dataset;

var svg = d3.select('body')
    .append('svg')
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .attr('id', "svg")

var chart = svg
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json(link).then(function (data) {

    data.forEach(function (d) {
        d.Time = parseTime(d.Time);
        d.Year = parseYear(d.Year);

    })

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) {
            return d.Year
        }))
        .range([0, width]);

    var formatTime = d3.timeFormat("%M:%S");
    var formatYear = d3.timeFormat("%Y");

    var y = data.map(function (d) {
        return d.Time
    })

    var max = d3.max(y);
    var min = d3.min(y);

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
        .text("YEAR");

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
        .attr("x", -3)
        .attr("y", 15)
        .style('text-anchor', 'end')
        .text("TIME (in minutes)")

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    chart.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => xScale(d.Year))
        .attr('cy', (d) => yScale(d.Time))
        .attr('r', 5)
        .attr("fill", function (d) {
            if (d.URL == "") {
                return "#24962E"
            } else {
                return "#BA0F20"
            }
        })
        .on("mouseover", function (d) {
            if (d.URL == "") {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(formatYear(d.Year) + " " + d.Name + "<br/>" + "Time: " + formatTime(d.Time))
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY) + "px");
            } else {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(formatYear(d.Year) + " " + d.Name + "<br/>" + "Time: " + formatTime(d.Time) + "<br/>"
                    + d.Doping)
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY) + "px");
            }
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


});