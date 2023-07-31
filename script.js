// Parameters
let selectedBrands = ['Toyota', 'Ford'];

// Event Listener for Checkboxes
d3.selectAll("input[type=checkbox]").on("change", function() {
  if (this.checked) {
    selectedBrands.push(this.value);
  } else {
    selectedBrands = selectedBrands.filter(brand => brand !== this.value);
  }
  createScene3(); // Update the scene
});

//
function createScene1() {
  d3.csv("main/cars2017.csv").then(data => {
    // Clear the existing visualization
    d3.select("#visualization").selectAll("*").remove();
    const svg = d3.select("#visualization");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by Make and calculate the average city MPG
    const groupedData = d3.nest()
      .key(d => d.Make)
      .rollup(v => d3.mean(v, d => +d.AverageCityMPG))
      .entries(data);

    const xScale = d3.scaleBand().rangeRound([0, width]).domain(groupedData.map(d => d.key)).padding(0.1);
    const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(groupedData, d => d.value)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.selectAll(".bar")
      .data(groupedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.key))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.value));

    // Annotations for Scene 1
    const highestMileageBrand = groupedData.reduce((max, brand) => (brand.value > max.value ? brand : max), groupedData[0]);
    const annotations = [
      {
        note: { label: "Highest average city mileage" },
        x: xScale(highestMileageBrand.key),
        y: yScale(highestMileageBrand.value),
        dy: -30,
        dx: 0
      }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Scene 2: Focus on the Top 5 Cars with the Highest Average Highway Mileage (Line Chart)
function createScene2() {
  d3.csv("main/cars2017.csv").then(data => {
    const top5Cars = data.sort((a, b) => b.AverageHighwayMPG - a.AverageHighwayMPG).slice(0, 5);
    
    // Clear the existing visualization
    d3.select("#visualization").selectAll("*").remove();
    const svg = d3.select("#visualization");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scalePoint().range([0, width]).domain(top5Cars.map(d => d.Make));
    const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(top5Cars, d => +d.AverageHighwayMPG)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.Make))
      .y(d => yScale(+d.AverageHighwayMPG));

    // Draw line
    g.append("path")
      .datum(top5Cars)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Annotations for Scene 2
    const annotations = [
      {
        note: { label: "Car with highest average highway mileage" },
        x: xScale(top5Cars[0].Make),
        y: yScale(+top5Cars[0].AverageHighwayMPG),
        dy: -30,
        dx: 0
      }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Scene 3: Comparison Between Engine Cylinders and Average City MPG for Selected Brands (Scatter Plot)
function createScene3() {
  d3.csv("main/cars2017.csv").then(data => {
    const selectedData = data.filter(d => selectedBrands.includes(d.Make));

    // Clear the existing visualization
    d3.select("#visualization").selectAll("*").remove();
    const svg = d3.select("#visualization");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]).domain([0, d3.max(selectedData, d => +d.EngineCylinders)]);
    const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(selectedData, d => +d.AverageCityMPG)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.selectAll(".dot")
      .data(selectedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(+d.EngineCylinders))
      .attr("cy", d => yScale(+d.AverageCityMPG))
      .attr("r", 5);

    // Annotations for Scene 3
    const annotations = selectedData.map(car => ({
      note: { label: `${car.Make}: ${car.EngineCylinders} cylinders, ${car.AverageCityMPG} MPG` },
      x: xScale(+car.EngineCylinders),
      y: yScale(+car.AverageCityMPG),
      dy: -10,
      dx: 0
    }));
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Create the first scene on page load
createScene1();
