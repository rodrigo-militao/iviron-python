const rtgl_list = []
const time_limits = [2, 4, 6, 8, 10]
var audiencia_chart
let selected
let each_person_data = []

$(document).ready(() => {
  start()

  const today = new Date().toLocaleDateString()
  const current_month = today.split('/')[1]
  const current_year = today.split('/')[2]
  $("#start_time_input_audiencia").val(`${current_year}-${current_month}-01`)
  $("#end_time_input_audiencia").val(`${current_year}-${current_month}-${new Date(current_year, current_month, 0).getDate().toString()}`)

  $("#audiencia_reload").on('click', function(e) {
    start()
  })
  
})

function start() {
  fetch(`/chart_data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      },
    }).then(res => res.json())
    .then(results => {
      const each_person = []
      const data = results.filter(e => e.forma == "rtgl").filter(e => isBetweenDatesAudiencia(new Date(e["dia-horario"])))

      data.map((e, index) => {

        if(!rtgl_list.find(el => el.id_forma == e.id_forma)) {
          rtgl_list.push({
            id_forma: e.id_forma,
            desc_forma: e.desc_forma
          })
        }

        const object = {
          id_pessoa: e.id_pessoa,
          id_forma: e.id_forma,
          desc_forma: e.desc_forma,
          entrou: new Date(e["dia-horario"]).toISOString(),
          saiu: "",
          diff: "",
        }
        //debugger
        if(e.entrou == 0)
        {
          //debugger
          const selected = each_person[each_person.length - 1]
          selected.saiu = new Date(e["dia-horario"]).toISOString()
          selected.diff = difference_between_dates_in_seconds(selected.saiu, selected.entrou)
        }
        else if(e.entrou == 1)
        {
          //debugger
          each_person.push(object)
        }
      })
      $("#audiencia_select").empty()
      $("#audiencia_select").append(`<option value="0">Selecione o setor</option>`)
      $("#audiencia_select").append( rtgl_list.map(el => `<option value="${el.id_forma}">${el.id_forma} - ${el.desc_forma}</option>`).join("") )


      $("#audiencia_select").on('change', function() {
        counting($(this).val(), each_person)
        selected = $(this).val()
      })

      counting(selected, each_person)
        

  })


}

function counting(id_forma, each_person) {
  //const id_forma = $(this).val()
  const data = each_person.filter(e => e.id_forma == id_forma)
  //console.log(data)
  const table_columns = []
  data.map(e => {
    let col_hora = ""
    const time = e.entrou.split("T")[1]
    const hour = time.split(":")[0]
    const minute = time.split(":")[1]
    const first_minute_number = minute[0] >= 3 ? 3 : 0
    col_hora = `${hour}:${first_minute_number}0`


    const column_obj = {
      desc_forma: e.desc_forma,
      col_hora,
      col_tempo_medio: e.diff,
      col_total_passagens: 1,
      sum_of_differences: e.diff,
      "2sec": e.diff > 0 && e.diff <= 2 ? 1 : 0,
      "4sec": e.diff > 2 && e.diff <= 4 ? 1 : 0,
      "6sec": e.diff > 4 && e.diff <= 6 ? 1 : 0,
      "8sec": e.diff > 6 && e.diff <= 8 ? 1 : 0,
      "10sec": e.diff > 8 && e.diff <= 10 ? 1 : 0,
      "plus10sec": e.diff > 10 ? 1 : 0,
    }

    if(table_columns.find(e => e.col_hora == column_obj.col_hora)) 
    {
      const index = table_columns.findIndex(el => el.col_hora == column_obj.col_hora)
      table_columns[index].col_total_passagens += 1
      table_columns[index].sum_of_differences += e.diff

      table_columns[index][`2sec`] += e.diff > 0 && e.diff <= 2 ? 1 : 0
      table_columns[index][`4sec`] += e.diff > 2 && e.diff <= 4 ? 1 : 0
      table_columns[index][`6sec`] += e.diff > 4 && e.diff <= 6 ? 1 : 0
      table_columns[index][`8sec`] += e.diff > 6 && e.diff <= 8 ? 1 : 0
      table_columns[index][`10sec`] += e.diff > 8 && e.diff <= 10 ? 1 : 0
      table_columns[index][`plus10sec`] += e.diff > 10 ? 1 : 0

      //if(column_obj.col_hora == "12:30") debugger
          
    } else table_columns.push(column_obj)

  })
  render_table(table_columns)
  render_audiencia_chart(table_columns)

}

//functions that renders a table receiving the columns as paremeter
function render_table(columns)
{
  const table_rows = columns.map(e => (
    `
    <tr class='audiencia_table_row'>
      <td>${e.col_hora}</td>
      <td>${e.desc_forma}</td>

      <td>${e["2sec"]}</td>
      <td>${Math.round((Number(e["2sec"])  / e.col_total_passagens) * 100)}</td>

      <td>${e["4sec"]}</td>
      <td>${Math.round((Number(e["4sec"])  / e.col_total_passagens) * 100)}</td>

      <td>${e["6sec"]}</td>
      <td>${Math.round((Number(e["6sec"])  / e.col_total_passagens) * 100)}</td>

      <td>${e["8sec"]}</td>
      <td>${Math.round((Number(e["8sec"])  / e.col_total_passagens) * 100)}</td>

      <td>${e["10sec"]}</td>
      <td>${Math.round((Number(e["10sec"])  / e.col_total_passagens) * 100)}</td>
      
      <td>${e["plus10sec"]}</td>
      <td>${Math.round((Number(e["plus10sec"])  / e.col_total_passagens) * 100)}</td>

      <td>${e.col_total_passagens}</td>
      <td>${parseInt(e.sum_of_differences / e.col_total_passagens)} sec</td>
    </tr>
    `
    )).join("")

  $("#audiencia_table").html(`
    <thead>
      <tr>
        <th>Hora</th>
        <th>Categoria</th>

        <th>Até 2 Seg</th>
        <th>% Até 2 Seg</th>

        <th>Até 4 Seg</th>
        <th>% Até 4 Seg</th>

        <th>Até 6 Seg</th>
        <th>% Até 6 Seg</th>

        <th>Até 8 Seg</th>
        <th>% Até 8 Seg</th>

        <th>Até 10 Seg</th>
        <th>% Até 10 Seg</th>
        
        <th>Mais de 10 Seg</th>
        <th>% Mais de 10 Seg</th>

        <th>Total Passagens</th>
        <th>Tempo Médio</th>
      </tr>
    </thead>
    <tbody>
        ${table_rows}
    </tbody>
  `)
}


function render_audiencia_chart(columns)
{
  if (audiencia_chart != undefined || audiencia_chart !=null) {
    audiencia_chart.destroy()
  }

  const ctx = document.getElementById('audiencia_chart').getContext('2d')

  audiencia_chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: columns.map(e => e.col_hora),
      datasets: [
        {
          label: 'Tempo Médio de Permanência',
          data: columns.map(e => parseInt(e.sum_of_differences / e.col_total_passagens)),
          backgroundColor: "rgba(133,187,224,255)",
          borderColor: "rgba(133,187,224,255)",
          hoverBackgroundColor: 'rgba(133,150,224,255)',
          hoverBorderColor: 'rgba(133,150,224,255)',
          fill: false,
        }
      ]
    }
  })


}

function isBetweenDatesAudiencia(date_to_check) {
  try {
    let start_range = $("#start_time_input_audiencia").val()
    let end_range = $("#end_time_input_audiencia").val()
    
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