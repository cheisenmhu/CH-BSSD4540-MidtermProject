/* 
Programmer: Chris Heise (cheise@live.nmhu.edu)
Course: BSSD 4540 - Data Visualization
Instructor: Rianne Trujillo
Program: Midterm Project
File: main.js
*/

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
        //console.log(res);
        nfl_totalyards = res.json();
        return nfl_totalyards;
    }).then((data) => {
        //console.log(data);
        grouped_by_team = Object.fromEntries(d3.group(data, d => d.team));
        grouped_by_season = Object.fromEntries(d3.group(data, d => d.season));
        //console.log(grouped_by_team);
        //console.log(grouped_by_season)
        DisplayChart();
    });
}

function DisplayChart() {
    const optContainer = document.getElementById('options');

    team_select = document.createElement('select');
    team_select.id = 'team_select';
    for (let team in grouped_by_team) {
        const option = document.createElement('option');
        option.value = team;
        option.text = team;
        team_select.appendChild(option);
    }
    team_select.addEventListener('change', updateChart);

    season_select = document.createElement('select');
    season_select.id = 'season_select';
    for (let season in grouped_by_season) {
        const option = document.createElement('option');
        option.value = season;
        option.text = season;
        season_select.appendChild(option);
    }
    season_select.addEventListener('change', updateChart);

    optContainer.appendChild(team_select);
    optContainer.appendChild(season_select);

    setupChart();
}

function setupChart() {
    const selected_team_stats = grouped_by_team[team_select.value];
    const selected_season_stats = Object.fromEntries(d3.group(selected_team_stats, d => d.season))[season_select.value];
    const yards_by_position = Object.fromEntries(d3.rollup(
        selected_season_stats,
        season => d3.sum(season, d => d.total_yards),
        d => d.position
    ));
    //console.log(yards_by_position);

    const data = {
        labels: Object.keys(yards_by_position),
        datasets: [{
            label: 'Yards Gained',
            data: Object.values(yards_by_position),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(0, 99, 255, 0.2)',
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

function updateChart() {
    yards_chart.destroy();
    setupChart();
}
