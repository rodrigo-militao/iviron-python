$(document).ready(() => {

  //$("#playback_date").val(new Date().toISOString().split('T')[0])

  const today = new Date()
  $("#day_playback_input").val(today.getDate())
  $("#month_playback_input").val(today.getMonth() + 1)
  $("#year_playback_input").val(today.getFullYear())
  
  $("#playback_btn").on('click', function() {
    change_playback_src()
  })

  function change_playback_src() {
    const video_path_static = "assets/videos"
    const video_extension = "mp4"
    
    const selected_date = $("#playback_date").val()
    const selected_time = $("#playback_time").val()
    const playback_video = document.getElementById('playback_video')

    const day = $("#day_playback_input").val()
    const month = $("#month_playback_input").val()
    const year = $("#year_playback_input").val()

    const hour = selected_time.split(":")[0]
    const minute = selected_time.split(":")[1]
    const first_minute_number = minute[0] >= 3 ? 3 : 0
    const video_current_time = Number(minute) >= 30 ? (Number(minute) - 30) * 60 : Number(minute) * 60;
    
    const video_path = `/${video_path_static}/${year}-${month}-${day}-${hour}${minute}.${video_extension}`
    console.log(video_path)
    playback_video.src = video_path
    playback_video.type = `video/${video_extension}`
    playback_video.load()
    playback_video.play()
  }
})
