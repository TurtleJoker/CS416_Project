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

// Scene 1: Overview of All Car Brands and Their Average Mileage
function createScene1() {
  d3.csv("https://github.com/TurtleJoker/CS416_Project/blob/main/cars2017.csv").then(data => {
    const svg = d3.select("#visualization").html("");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    xScale.domain(data.map(d => d.Brand));
    yScale.domain([0, d3.max(data, d => d.Mileage)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.Brand))
      .attr("y", d => yScale(d.Mileage))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.Mileage));

    // Annotations for Scene 1
    const annotations = [
      {
        note: { label: "Highest average mileage" },
        x: xScale("Toyota"), // Example
        y: yScale(35), // Example
        dy: -30,
        dx: 0
      }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Scene 2: Focus on the Top 5 Most Fuel-Efficient Cars (Line Chart)
function createScene2() {
  d3.csv("https://github.com/TurtleJoker/CS416_Project/blob/main/cars2017.csv").then(data => {
    const top5Cars = data.sort((a, b) => b.Mileage - a.Mileage).slice(0, 5);
    const svg = d3.select("#visualization").html("");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    xScale.domain(top5Cars.map(d => d.Car));
    yScale.domain([0, d3.max(top5Cars, d => d.Mileage)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.Car))
      .y(d => yScale(d.Mileage));

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
        note: { label: "Most fuel-efficient car" },
        x: xScale("Example Car"), // Example
        y: yScale(35), // Example
        dy: -30,
        dx: 0
      }
    ];
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Scene 3: Comparison Between Horsepower and Price for Selected Brands (Scatter Plot)
function createScene3() {
  d3.csv("https://github.com/TurtleJoker/CS416_Project/blob/main/cars2017.csv").then(data => {
    const selectedData = data.filter(d => selectedBrands.includes(d.Brand));
    const svg = d3.select("#visualization").html("");
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    xScale.domain([0, d3.max(selectedData, d => d.Horsepower)]);
    yScale.domain([0, d3.max(selectedData, d => d.Price)]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.selectAll(".dot")
      .data(selectedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Horsepower))
      .attr("cy", d => yScale(d.Price))
      .attr("r", 5);

    // Annotations for Scene 3
    const annotations = selectedData.map(car => ({
      note: { label: car.Car },
      x: xScale(car.Horsepower),
      y: yScale(car.Price),
      dy: -10,
      dx: 0
    }));
    const makeAnnotations = d3.annotation().annotations(annotations);
    g.append("g").call(makeAnnotations);
  });
}

// Create the first scene on
createScene1();
