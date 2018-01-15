$(document).ready(function(){
  var ctx = document.getElementById("myChart").getContext('2d');
  var labels=[];
  var data = [];
  var color = [];
  var borderColor = [];
  for(var i=0;i<options.length;i++){
    labels.push(options[i].description);
    data.push(options[i].voteCount);
    color.push('grey');
    borderColor.push('black');
  }

  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: color,
              borderColor: borderColor,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
})
