document.addEventListener("DOMContentLoaded", function() {
  fetchDataAndCreateChart();
});

function fetchDataAndCreateChart() {
  // Fetch the data from the API
  fetch("https://api.sportsdata.io/v3/mlb/scores/json/Standings/2022?key=e94f83b07c23407eb1b11d55148cdbc1")
    .then(response => response.json())
    .then(data => {
      createChart(data);
    })
    .catch(err => console.error(err));
}

function createChart(data) {
  // Extract run differential and wins data
  const runDifferentialData = data.map(team => team.RunsScored - team.RunsAgainst);
  const winsData = data.map(team => team.Wins);

  const containerWidth = d3.select("#chart-container").node().getBoundingClientRect().width;
  const chartWidth = containerWidth / 3;

  // Create the D3.js chart
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${chartWidth} 400`);

  // Set up scales
  const xScale = d3.scaleLinear()
    .domain([-350, 350])
    .range([50, 450]); // Adjust positioning as needed

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(winsData)])
    .range([350, 50]); // Adjust positioning as needed

  // Create circles for data points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.RunsScored - d.RunsAgainst)) // Use run differential
    .attr("cy", d => yScale(d.Wins))
    .attr("r", 5)
    .attr("fill", "blue"); // Set circle color to blue

  // Append x and y axes to the SVG
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", `translate(0, ${yScale.range()[0]})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${xScale.range()[0]}, 0)`)
    .call(yAxis);

  // Add tick marks to the axes
  svg.selectAll(".x-axis .tick line")
    .attr("y2", -(yScale.range()[0] - yScale.range()[1]))
    .attr("stroke", "lightgray");

  svg.selectAll(".y-axis .tick line")
    .attr("x2", xScale.range()[1] - xScale.range()[0])
    .attr("stroke", "lightgray");

  // Add axis labels
  svg.append("text")
    .attr("x", 250)
    .attr("y", 390)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text("Run Differential");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -190)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .text("Wins");
}
document.getElementById("submit").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent form submission

  var name = document.getElementById("team_name").value;
  var foundTeam = null;
  var html = "";

  fetch("https://api.sportsdata.io/v3/mlb/scores/json/TeamSeasonStats/2023?key=e94f83b07c23407eb1b11d55148cdbc1")
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].Name)
        if (data[i].Name === name) {
          foundTeam = data[i];
          break;
        }
      }

      if (foundTeam) {
        var iso = (foundTeam.Doubles + 2 * foundTeam.Triples + 3 * foundTeam.HomeRuns) / foundTeam.AtBats;
        var kpct = (foundTeam.Strikeouts / foundTeam.PlateAppearances)*100;
        iso = iso.toFixed(2);
        kpct = kpct.toFixed(2);
        rs = -566.72 + 1704.81*foundTeam.OnBasePlusSlugging + 373.1*iso;
        ra = 69.24+158.66*foundTeam.EarnedRunAverage-24.49*(kpct/100);
        rd = rs - ra;
        w = 81 + .1*rd;
        rs = rs.toFixed(2);
        ra = ra.toFixed(2);
        rd = rd.toFixed(2);
        w = w.toFixed(2);
        html = "<div><p>Team: " + foundTeam.Name + "</p><p>Team OPS: " + foundTeam.OnBasePlusSlugging +
          "</p><p>Team ISO: " + iso + "</p><p>Team ERA: " + foundTeam.EarnedRunAverage +
          "</p><p>Team k%: " + kpct +"</p><p>Expected Runs: " + rs +"</p><p>Expected Runs Against: " + ra +
          "</p><p>RD: " + rd +"</p><p>Expected Wins: " + w + "</p> </div>";
      } else {
        html = "<div>No data found for the team: " + name + "</div>";
      }

      document.getElementById("form_response").innerHTML = html;
    })
    .catch(err => console.error(err));

  
});
