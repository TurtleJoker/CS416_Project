// Global variable to track selected brands
let selectedBrands = ['Toyota', 'Ford'];

// Event Listener for Checkboxes
d3.selectAll("input[type=checkbox]").on("change", function () {
  if (this.checked) {
    selectedBrands.push(this.value);
  } else {
    selectedBrands = selectedBrands.filter(brand => brand !== this.value);
  }
  updateScene(); // Update the scene
});

// Global variable to track current scene
let currentScene = 1;

// Function to update current scene based on selected brands
function updateScene() {
  if (currentScene === 1) {
    createScene1();
  } else if (currentScene === 2) {
    createScene2();
  } else if (currentScene === 3) {
    createScene3();
  }
}

// Scene 1: Overview of Car Brands and Their Average City Mileage
function createScene1() {
  currentScene = 1;
  d3.select("#sceneTitle").text("Overview of Car Brands' Average City Mileage");
  d3.csv("https://raw.githubusercontent.com/TurtleJoker/CS416_Project/main/cars2017.csv").then(data => {
    // Clear the existing visualization
    const svg = d3.select("#visualization").html("");
    const margin = { top: 20, right: 20, bottom: 80, left: 80 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Average mileage by brand
    const averageMileageByBrand = d3.nest()
      .key(d => d.Make)
      .rollup(v => d3.mean(v, d => +d["City MPG"]))
      .entries(data);

    const xScale = d3.scaleBand().rangeRound([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    xScale.domain(averageMileageByBrand.map(d => d.key));
    yScale.domain([0, d3.max(averageMileageByBrand, d => d.value)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .style("text-anchor", "end");
    

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.selectAll(".bar")
      .data(averageMileageByBrand)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.key))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.value));

    // Annotations for Scene 1
    const annotations = [
      {
        note: { label: "Highest average city mileage" },
        x: xScale("Toyota"), // Example
        y: yScale(28), // Example
        dy: -30,
        dx: 0
      }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Scene 2: Focus on the Top 5 Most Fuel-Efficient Cars on the Highway
function createScene2() {
  currentScene = 2;
  d3.select("#sceneTitle").text("Top 5 Most Fuel-Efficient Cars on the Highway");
  d3.csv("https://raw.githubusercontent.com/TurtleJoker/CS416_Project/main/cars2017.csv").then(data => {
    const top5Cars = data.sort((a, b) => b.AverageHighwayMPG - a.AverageHighwayMPG).slice(0, 5);
    
    // Clear the existing visualization
    d3.select("#visualization").selectAll("*").remove();
    const svg = d3.select("#visualization");
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scalePoint().range([0, width]).domain(top5Cars.map(d => d.Make));
    const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(top5Cars, d => +d.AverageHighwayMPG)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
      .selectAll("text")
      .attr("transform", "rotate(-45)") // Rotate labels by 45 degrees
      .style("text-anchor", "end"); // Align the text at the end
    
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

// Scene 3: Comparison Between Engine Cylinders and Average City MPG for Selected Brands
function createScene3() {
  currentScene = 3;
  d3.select("#sceneTitle").text("Comparison Between Engine Cylinders and Average City MPG for Selected Brands");
  // Filter data based on selected brands
  d3.csv("https://raw.githubusercontent.com/TurtleJoker/CS416_Project/main/cars2017.csv").then(data => {
    const filteredData = data.filter(d => selectedBrands.includes(d.Brand));

    // Clear the existing visualization
    d3.select("#visualization").selectAll("*").remove();
    const svg = d3.select("#visualization");
    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
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
