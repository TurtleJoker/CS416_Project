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

    // Group data by Make and calculate the average city MPG
    const groupedData = d3.nest()
      .key(d => d.Make)
      .rollup(v => d3.mean(v, d => +d.AverageCityMPG))
      .entries(data)
      .sort((a, b) => a.value - b.value);

    const xScale = d3.scaleBand().rangeRound([0, width]).domain(groupedData.map(d => d.key));
    const yScale = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(groupedData, d => d.value)]);

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
      .data(groupedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.key))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.value))
      .attr("fill", "lightblue")
      .attr("stroke", "black")
      .attr("stroke-width", 1);

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

// Scene 2: Focus on the Top 5 Most Fuel-Efficient Cars on the Highway
function createScene2() {
  currentScene = 2;
  d3.select("#sceneTitle").text("Top 5 Most Fuel-Efficient Cars on the Highway");
  d3.csv("https://raw.githubusercontent.com/TurtleJoker/CS416_Project/main/cars2017.csv").then(data => {
    const svg = d3.select("#visualization").html("");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Top 5 cars by highway mileage
    const top5Cars = data.sort((a, b) => b.AverageHighwayMPG - a.AverageHighwayMPG).slice(0, 5);

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
        y: yScale(+top5Cars[0]["AverageHighwayMPG"]),
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
    const selectedData = data.filter(d => selectedBrands.includes(d.Make));
    const svg = d3.select("#visualization").html("");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([0, d3.max(selectedData, d => +d["EngineCylinders"])]);
    yScale.domain([0, d3.max(selectedData, d => +d["AverageCityMPG"])]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.selectAll(".dot")
      .data(selectedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(+d["EngineCylinders"]))
      .attr("cy", d => yScale(+d["AverageCityMPG"]))
      .attr("r", 5)
      .attr("fill", d => d.Make === "Toyota" ? "red" : "blue")
      .on("mouseover", function (d) {
        // Create annotation for the hovered item
        const annotation = [
          {
            note: { label: `${d.Make}: ${d.EngineCylinders} cylinders, ${d.AverageCityMPG} MPG` },
            x: xScale(+d.EngineCylinders),
            y: yScale(+d.AverageCityMPG),
            dy: -10,
            dx: 0
          }
        ];
        const makeAnnotations = d3.annotation().annotations(annotation);
        g.append("g").attr("class", "annotation-group").call(makeAnnotations);
      })
      .on("mouseout", function () {
        // Remove annotation when mouse leaves the item
        g.selectAll(".annotation-group").remove();
      });
  });
}

// Create the first scene on page load
createScene1();
