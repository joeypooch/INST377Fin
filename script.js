// Initialize variables to hold the selected league and division
var selectedLeague = "";
var selectedDivision = "";

// Add event listeners to the select elements
document.getElementById("league-select").addEventListener("change", function() {
  selectedLeague = this.value;
  displayMLBStandings();
});

document.getElementById("division-select").addEventListener("change", function() {
  selectedDivision = this.value;
  displayMLBStandings();
});

function createStandingsTable(data, league, division) {
  data.sort((a, b) => b.Wins - a.Wins); 
  // Filter the data based on the selected league and division
  var filteredData = data.filter(team => {
    if (league && league !== team.League) {
      return false;
    }
    if (division && division !== team.Division) {
      return false;
    }
    return true;
  });

  // Build the HTML for the standings table
    var tableHtml = "<div class='table-responsive'><table class='table table-striped table-bordered'><thead class='thead-dark'><tr><th>Team</th><th>Wins</th><th>Losses</th><th>Win Percentage</th><th>Runs For</th><th>Runs Against</th><th>Run Differential</th></tr></thead><tbody>";
    // Loop through the filtered data and add a row to the table for each team
    filteredData.forEach(team => {
    var winPercentage = (team.Wins / (team.Wins + team.Losses)).toFixed(3);
    var runDif = team.RunsScored - team.RunsAgainst;
    tableHtml += "<tr><td>" + team.Name + "</td><td>" + team.Wins + "</td><td>" + team.Losses + "</td><td>" + winPercentage + "</td><td>" + team.RunsScored + "</td><td>" + team.RunsAgainst + "</td><td>" + runDif + "</td></tr>";
    });
    tableHtml += "</tbody></table></div>";

    // Close the table HTML
    tableHtml += "</tbody></table>";

  // Return the HTML string
  return tableHtml;
}

function displayMLBStandings() {
  // Build the URL to fetch the standings data from SportsDataIO API
  var url = "https://api.sportsdata.io/v3/mlb/scores/json/Standings/2023?key=e94f83b07c23407eb1b11d55148cdbc1";

  // Fetch the data from SportsDataIO API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Create the standings table HTML with the selected league and division
      var tableHtml = createStandingsTable(data, selectedLeague, selectedDivision);

      // Display the standings table
      document.getElementById("standings").innerHTML = tableHtml;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("standings").innerHTML = "Error fetching standings data. Status Code: " + err.status;
    });
}


  
document.addEventListener("DOMContentLoaded", function () {
    // Call the displayMLBStandings() function when the page loads
    displayMLBStandings();
  
  });
  