$(document).ready(() => {

  $("#playback_date").val(new Date().toISOString().split('T')[0])

  
  $("#ver_ao_vivo").on('click', function() {
    $("#playback_video_div").hide()
    $("#live_video").show()
  })
  $("#ver_playback").on('click', function() {
    $("#live_video").hide()
    change_playback_src()
    $("#playback_video_div").show()
  })

  function change_playback_src() {
    const video_path_static = "assets/videos"
    const video_extension = "mp4"
    
    const selected_date = $("#playback_date").val()
    const selected_time = $("#playback_time").val()
    const playback_video = document.getElementById('playback_video')

    const day = selected_date.split('-')[2]
    const month = selected_date.split('-')[1]
    const year = selected_date.split('-')[0]
    const hour = selected_time.split(":")[0]
    const minute = selected_time.split(":")[1]
    const first_minute_number = minute[0] >= 3 ? 3 : 0
    const video_current_time = Number(minute) >= 30 ? (Number(minute) - 30) * 60 : Number(minute) * 60;
    
    
    const video_path = `/${video_path_static}/${year}-${month}-${day}-${hour}${minute}.${video_extension}`
    playback_video.src = video_path
    playback_video.type = `video/${video_extension}`
    playback_video.load()
    playback_video.play()
  }
})
