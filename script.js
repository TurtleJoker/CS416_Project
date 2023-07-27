d3.json('https://d3js.org/world-50m.v1.json')
  .then(world => {
    const countries = topojson.feature(world, world.objects.countries).features;
    d3.csv('emissionsData.csv').then(emissionsData => {
      createMap(countries, emissionsData);
    });
  });

function createMap(countries, emissionsData) {
  // Create SVG
  const svg = d3.select('body').append('svg').attr('width', 800).attr('height', 600);

  // Create projection
  const projection = d3.geoNaturalEarth1().scale(125).translate([400, 300]);
  const path = d3.geoPath().projection(projection);

  // Scale for country fill color
  const emissionsScale = d3.scaleLinear().domain([0, d3.max(emissionsData, d => d.emissions)]).range(['white', 'red']);

  // Draw countries on the map
  svg.selectAll('path')
    .data(countries)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', d => {
      const countryEmissions = emissionsData.find(e => e.country === d.properties.name);
      return countryEmissions ? emissionsScale(countryEmissions.emissions) : '#ccc';
    })
    .on('click', function(event, d) {
      const countryEmissions = emissionsData.find(e => e.country === d.properties.name);
      if (countryEmissions) {
        createBarChart(countryEmissions);
      }
    });
}

function createBarChart(countryEmissions) {
  // Clear SVG
  d3.select('svg').remove();

  // Create new SVG
  const svg = d3.select('body').append('svg').attr('width', 800).attr('height', 600);

  // Create scales
  const xScale = d3.scaleBand()
    .domain(countryEmissions.emissions.map(d => d.year))
    .range([0, 800])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(countryEmissions.emissions, d => d.amount)])
    .range([600, 0]);

  // Create axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);

  // Draw axes
  svg.append("g")
    .attr("transform", "translate(0,600)")
    .call(xAxis);

  svg.append("g").call(yAxis);

  // Draw bars
  svg.selectAll('rect')
    .data(countryEmissions.emissions)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.year))
    .attr('y', d => yScale(d.amount))
    .attr('width', xScale.bandwidth())
    .attr('height', d => 600 - yScale(d.amount))
    .attr('fill', 'steelblue');
}
