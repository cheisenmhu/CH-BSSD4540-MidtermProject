/* 
Programmer: Chris Heise (cheise@live.nmhu.edu)
Course: BSSD 4540 - Data Visualization
Instructor: Rianne Trujillo
Program: Midterm Project
File: main.js
*/

// NFL Statistics Data from: https://www.kaggle.com/datasets/philiphyde1/nfl-stats-1999-2022?select=weekly_data_updated_08_23.csv

let nfl_totalyards;
let grouped_by_team;
let grouped_by_season;
let team_select;
let season_select;
let yards_chart;


GetData();

function GetData() {
    fetch('../data/nfl_totalyards.json')
    .then((res) => {

        nfl_totalyards = res.json();
        return nfl_totalyards;

    }).then((data) => {

        grouped_by_team = Object.fromEntries(d3.group(data, d => d.team));
        grouped_by_season = Object.fromEntries(d3.group(data, d => d.season));
        setupPage();
    });
}

function setupPage() {
    const optContainer = document.getElementById('options');

    // Dropdown for selecting an NFL team
    team_select = document.createElement('select');
    team_select.id = 'team_select';
    for (let team in grouped_by_team) {
        const option = document.createElement('option');
        option.value = team;
        option.text = team;
        team_select.appendChild(option);
    }
    team_select.addEventListener('change', updateChart);

    const team_label = document.createElement('label');
    team_label.for = 'team_select';
    team_label.innerHTML = 'NFL Team: ';
    team_label.style.marginLeft = '1em';
    team_label.style.marginRight = '2px';

    // Dropdown for selecting a season
    season_select = document.createElement('select');
    season_select.id = 'season_select';
    for (let season in grouped_by_season) {
        const option = document.createElement('option');
        option.value = season;
        option.text = season;
        season_select.appendChild(option);
    }
    season_select.addEventListener('change', updateChart);

    const season_label = document.createElement('label');
    season_label.for = 'season_select';
    season_label.innerHTML = 'Season: ';
    season_label.style.marginLeft = '1em';
    season_label.style.marginRight = '2px';

    // Add elements to page
    optContainer.appendChild(team_label);
    optContainer.appendChild(team_select);
    optContainer.appendChild(season_label);
    optContainer.appendChild(season_select);

    setupChart();
}

function setupChart() {
    // Get user's selected data
    const selected_team_stats = grouped_by_team[team_select.value];
    const selected_season_stats = Object.fromEntries(d3.group(selected_team_stats, d => d.season))[season_select.value];
    const yards_by_position = Object.fromEntries(d3.rollup(
        selected_season_stats,
        season => d3.sum(season, d => d.total_yards),
        d => d.position
    ));
    // Use below to test if data displayed is correct
    //console.log(yards_by_position);

    // Setup and Display Chart
    const data = {
        labels: Object.keys(yards_by_position),
        datasets: [{
            label: 'Yards Gained',
            data: Object.values(yards_by_position),
            backgroundColor: [
                'rgba(154, 24, 231, 0.5)',
                'rgba(231, 51, 24, 0.5)',
                'rgba(101, 231, 24, 0.5)',
                'rgba(24, 204, 231, 0.5)',
            ],
            hoverOffset: 4
        }]
    }

    const ctx = document.getElementById('chart');

    yards_chart = new Chart(ctx, {
        type: 'pie',
        data: data
    });

}

// Method for updating chart after a new selection is made
function updateChart() {
    yards_chart.destroy();
    setupChart();
}
