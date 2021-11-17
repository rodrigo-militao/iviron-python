const set_config = async (data) => {
  await fetch('/set_config', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({data: data})
  })
}

const change_chart_config_file = async (path) => {
  await fetch('/change_chart_config_file', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({path: path})
  })
}

  //const change_video_config_file = window.file.change_video_config_file
const change_video_config_file = async (path) => {
  await fetch('/change_video_config_file', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({path: path})
  })
}