let chart_type_selected = 'bar'
let chart_filter_selected = 'dia'
let chart_filter_dia_selected = 'min'
var count_chart

  
$(document).ready(() => {

  const today = new Date().toLocaleDateString()
  const current_month = today.split('/')[1]
  const current_year = today.split('/')[2]

  $("#start_time_input").val(`${current_year}-${current_month}-01`)
  $("#end_time_input").val(`${current_year}-${current_month}-${new Date(current_year, current_month, 0).getDate().toString()}`)

  $("input[name='chart_period']").on('change', function() {
    const valor = $(this).val()
    chart_filter_selected = valor
    render_count_chart(chart_type_selected)
  })

  $("input[name='chart_type']").on('change', function() {
    const valor = $(this).val()
    chart_type_selected = valor
    render_count_chart(valor)
  })
  $("select[id='dia_input']").on('change', function() {
    const valor = $(this).val()
    chart_filter_dia_selected = valor
    render_count_chart(chart_type_selected)
  })

  $("#config_chart_file_input").on('change', function() {
    const file_path = this.files[0].path
    console.log( this.files[0])
    //change_chart_config_file(file_path)
  })


  $(".time_input").on('change', () => {
    render_count_chart(chart_type_selected)
  })

  $("#update_chart").on('click', () => {
    render_count_chart(chart_type_selected)
  })

  render_count_chart()

})

function formatMonth(date_month)  {
  const month = date_month + 1;

  return month > 9 ? month : "0" + month
}

function formatDay (day) {
  return day > 9 ? day : "0" + day
}

function formatTime(full_date) {
  const time = formatDay(full_date.getDate()) + "/" + formatMonth(full_date.getMonth()) + "/" + full_date.getFullYear() + ' - ' + full_date.getHours() + ":" + full_date.getMinutes()

  return time
}


function render_count_chart (chart_type = 'bar'){
  const chartLabels = []
  const chartEntradas = []
  const chartSaidas = []
  let defined_x_axes = []

  //se o gráfico já existe, retira e cria novamente.
  if (count_chart != undefined || count_chart !=null) {
    count_chart.destroy()
  }


  fetch(`/chart_data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      },
    }).then(res => res.json())
    .then(results => {
    new Promise((resolve, reject) =>  {
        const data = results
        
        const filtered_by_date_interval = data.filter(e => e.forma == "reta").filter(e => isBetweenDates(new Date(e["dia-horario"])))

        if (chart_filter_selected == 'mes') {
          $("select[id='dia_input']").css('display', 'none')
          filtered_by_date_interval.map(el => {
            el["dia-horario"] = new Date(el["dia-horario"])
            const curr_year = el["dia-horario"].getFullYear()
            const curr_month = formatMonth(el["dia-horario"].getMonth()) + '/' + curr_year
            let mes_index = chartLabels.indexOf(curr_month)
            if(mes_index == -1) chartLabels.push(curr_month)
            mes_index = chartLabels.indexOf(curr_month)

            chartEntradas[mes_index] = (isNaN(Number(chartEntradas[mes_index])) ? 0 : Number(chartEntradas[mes_index])) + Number(el.entrou)
            chartSaidas[mes_index] = (isNaN(Number(chartSaidas[mes_index])) ? 0 : Number(chartSaidas[mes_index])) + (Number(el.entrou) == 0  ? 1 : 0)
          })

        }
        else if (chart_filter_selected == 'ano') {
          $("select[id='dia_input']").css('display', 'none')

          filtered_by_date_interval.map(el => {
            el["dia-horario"] = new Date(el["dia-horario"])
            const curr_year = el["dia-horario"].getFullYear()
            let ano_index = chartLabels.indexOf(curr_year)
            if(ano_index == -1) chartLabels.push(curr_year)
            ano_index = chartLabels.indexOf(curr_year)

            chartEntradas[ano_index] = (isNaN(Number(chartEntradas[ano_index])) ? 0 : Number(chartEntradas[ano_index])) + Number(el.entrou)
            chartSaidas[ano_index] = (isNaN(Number(chartSaidas[ano_index])) ? 0 : Number(chartSaidas[ano_index])) + (Number(el.entrou) == 0  ? 1 : 0)
            debugger
          })

        }
        else {
          $("select[id='dia_input']").css('display', 'block')

          filtered_by_date_interval.map(el => {
            el["dia-horario"] = new Date(el["dia-horario"])
            let col_hora = ""
            let time = formatTime(el["dia-horario"])
            const hour = time.split("-")[1].split(":")[0]
            const minute = time.split("-")[1].split(":")[1]
            let first_minute_number = 0
            if(chart_filter_dia_selected == 'half'){
              first_minute_number = minute[0] >= 3 ? 3 : 0
            }

            col_hora = `${time.split("-")[0]} - ${hour}:${first_minute_number}0`

            let time_index = chartLabels.indexOf(chart_filter_dia_selected == 'min' ? time : col_hora)
            if(time_index == -1) chartLabels.push(chart_filter_dia_selected == 'min' ? time : col_hora)
            time_index = chartLabels.indexOf(chart_filter_dia_selected == 'min' ? time : col_hora)

            if (isNaN(Number(chartEntradas[time_index]))) {
              chartEntradas[time_index] = 0
              chartSaidas[time_index] = 0
            }

            if(Number(el.entrou) == 1) {
              chartEntradas[time_index] = Number(chartEntradas[time_index]) + 1
            } else {
              chartSaidas[time_index] = Number(chartSaidas[time_index]) + 1
            }

          })


        }

        const chart_data = {
          chartLabels,
          chartEntradas,
          chartSaidas,
          chart_type
        }

        resolve(chart_data)
      }
    ).then(
      (data) => {
        render_chart(data)
      }
    );


  });


}


function isBetweenDates(date_to_check) {
  try {
    let start_range = $("#start_time_input").val()
    let end_range = $("#end_time_input").val()
    
    start_range = new Date(start_range.split('-')[0], start_range.split('-')[1] - 1, start_range.split('-')[2])
    end_range = new Date(end_range.split('-')[0], end_range.split('-')[1] - 1, end_range.split('-')[2])
    end_range.setHours(23, 59, 59, 999)

    if (date_to_check.getTime() <= end_range.getTime() && date_to_check.getTime() >= start_range.getTime()) {
      return true
    } else {
      return false
    }
  }
  catch {
    return false
  }
}

function render_chart({
  chart_type,
  chartLabels,
  chartEntradas,
  chartSaidas,
}) {
  const ctx = document.getElementById('myChart').getContext('2d')
  count_chart = new Chart(ctx, {
      type: chart_type,
      data: {
          labels: chartLabels,
          datasets: [
              {
                  label: 'Entradas',
                  data:  chartEntradas,
                  backgroundColor: "rgb(235,156,172)",
                  borderColor: "rgb(235,156,172)",
                  hoverBackgroundColor: 'rgb(205,156,172)',
                  hoverBorderColor: 'rgb(205,156,172)',
                  borderWidth: 2
              },
              {
                  label: 'Saídas',
                  data: chartSaidas,
                  backgroundColor: "rgba(133,187,224,255)",
                  borderColor: "rgba(133,187,224,255)",
                  hoverBackgroundColor: 'rgba(133,150,224,255)',
                  hoverBorderColor: 'rgba(133,150,224,255)',
                  borderWidth: 2
              },
          ]
      },
      options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              },
            }],
              xAxes: [
                {
                  id:'xAxis1',
                  type:"category",
                  ticks:{
                    callback:function(label){
                      var date = label.split(" - ")[0]
                      var time = label.split(" - ")[1]
                      return time;
                    }
                  }
                },
                {
                  id:'xAxis2',
                  type:"category",
                  gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                  ticks:{
                    callback:function(label){
                      var date = label.split(" - ")[0]
                      var time = label.split(" - ")[1]
                      return date
                    }
                  },
                }],
          },
          hover: {
            mode: null
          },
      }
  })
}
