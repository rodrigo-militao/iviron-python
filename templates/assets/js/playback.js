$(document).ready(() => {
  var video_path = ''
  //const change_video_config_file = window.file.change_video_config_file
  const open_video = window.file.open_video
  const download_video = window.file.download_video


  $("#playback_date").val(new Date().toISOString().split('T')[0])
  $("#playback_date").on('change', function() {
    change_playback_src()
  })

  $("#playback_time").on('change', function() {
    change_playback_src()
  })

  
  $("#config_video_file_input").on('change', function() {
    if(this.files.length > 0) {
      const file_path = this.files[0].path
      change_videos_folder(file_path)
    } else {
      alert('Pasta vazia! Selecione uma pasta contendo as gravações.')
    }
  })

  $("#assistir_video").on('click', function() {
    console.log(video_path)
    open_video(video_path)
  })
  $("#download_video").on('click', function() {
    console.log(video_path)
    download_video(video_path)
  })



  change_playback_src()



   //Function definitions
  function change_videos_folder(file_path) {
    const intPos = file_path.lastIndexOf("\\") == -1 ? file_path.lastIndexOf("/") : file_path.lastIndexOf("\\");
    const folder_path = file_path.substring(0, intPos);
    change_video_config_file(folder_path)
    change_playback_src()
  }
  
  
  function change_playback_src() {
    const selected_date = $("#playback_date").val()
    const selected_time = $("#playback_time").val()

    const hour = selected_time.split(":")[0]
    const minute = selected_time.split(":")[1]
    const first_minute_number = minute[0] >= 3 ? 3 : 0
    const playback_video = document.getElementById('playback_video')
    let records_path = ''

    const video_current_time = Number(minute) >= 30 ? (Number(minute) - 30) * 60 : Number(minute) * 60;
    
  
    $.getJSON(JSON_CONFIG_FILE, function(config) {
      records_path = config.video_data_path
    }).then(() => {

      const source = `${records_path}/${selected_date}-${hour}${first_minute_number}0.h264`

      $("#path").text(source)

      video_path = source
  
    })
  
  }
})
