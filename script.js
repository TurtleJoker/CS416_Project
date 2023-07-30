let selectedBrands = ['Toyota', 'Ford'];

d3.csv("cars2017.csv").then(data => {
  const groupedData = d3.group(data, d => d.Brand);
  const averageMileage = Array.from(groupedData).map(([key, value]) => {
    const avg = d3.mean(value, d => +d.Mileage);
    return { Brand: key, Mileage: avg };
  });
  createScene1(averageMileage);
});

function createScene1(data) {
  // Select and clear the SVG container
  const svg = d3.select("#visualization").html("");

  // Define scales
  const xScale = d3.scaleBand().domain(data.map(d => d.Brand)).range([0, 800]);
  const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.Mileage)]).range([600, 0]);

  // Draw bars
  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", d => xScale(d.Brand))
    .attr("y", d => yScale(d.Mileage))
    .attr("width", xScale.bandwidth())
    .attr("height", d => 600 - yScale(d.Mileage))
    .attr("fill", "steelblue");

  // Add axes
  svg.append("g").attr("transform", "translate(0,600)").call(d3.axisBottom(xScale));
  svg.append("g").call(d3.axisLeft(yScale));

  const highestMileageBrand = d3.max(data, d => d.Mileage);
  const annotations = [
    {
      note: { label: "Highest average mileage" },
      x: xScale(highestMileageBrand.Brand),
      y: yScale(highestMileageBrand.Mileage),
      dy: -30,
      dx: 0
    }
  ];

  const makeAnnotations = d3.annotation().annotations(annotations);
  svg.append("g").call(makeAnnotations);
}

function createScene2() {
  d3.csv("cars2017.csv").then(data => {
    const top5Cars = data.sort((a, b) => b.Mileage - a.Mileage).slice(0, 5);

    // Select and clear the SVG container
    const svg = d3.select("#visualization").html("");

    // Define scales
    const xScale = d3.scaleBand().domain(top5Cars.map(d => d.Car)).range([0, 800]);
    const yScale = d3.scaleLinear().domain([0, d3.max(top5Cars, d => +d.Mileage)]).range([600, 0]);

    // Draw bars
    svg.selectAll("rect")
      .data(top5Cars)
      .enter().append("rect")
      .attr("x", d => xScale(d.Car))
      .attr("y", d => yScale(d.Mileage))
      .attr("width", xScale.bandwidth())
      .attr("height", d => 600 - yScale(d.Mileage))
      .attr("fill", "green");

    // Add axes
    svg.append("g").attr("transform", "translate(0,600)").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));
  });
}

function createScene3() {
  d3.csv("cars2017.csv").then(data => {
    // Filter data for selected brands (e.g., 'Toyota', 'Ford')
    const selectedData = data.filter(d => selectedBrands.includes(d.Brand));

    // Select and clear the SVG container
    const svg = d3.select("#visualization").html("");

    // Define scales
    const xScale = d3.scaleLinear().domain([0, d3.max(selectedData, d => +d.Horsepower)]).range([0, 800]);
    const yScale = d3.scaleLinear().domain([0, d3.max(selectedData, d => +d.Price)]).range([600, 0]);

    // Draw circles
    svg.selectAll("circle")
      .data(selectedData)
      .enter().append("circle")
      .attr("cx", d => xScale(d.Horsepower))
      .attr("cy", d => yScale(d.Price))
      .attr("r", 5)
      .attr("fill", d => d.Brand === 'Toyota' ? "red" : "blue");

    // Add axes
    svg.append("g").attr
