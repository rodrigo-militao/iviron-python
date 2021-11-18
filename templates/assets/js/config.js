$(document).ready(() => {
  $("#config_save").on('click', function() {
    const data = [
      {path: 'cliente', value: $("#config_cliente").val() },
      {path: 'localizacao', value: $("#config_localizacao").val() },
      {path: 'tag', value: $("#config_tag").val() },
    ]

    set_config(data)

    $("#cliente").text($("#config_cliente").val())
    $("#localizacao").text($("#config_localizacao").val())
    $("#tag").text($("#config_tag").val())

    //show message for 3 seconds
    $("#config_message").text("Configurações salvas com sucesso!")
    $("#config_message").show()
    setTimeout(function() {
      $("#config_message").hide()
    }, 3000)
  })
})