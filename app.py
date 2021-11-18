import cv2
from flask import Flask, render_template, request, Response
from Utils import Utils
from flask_ngrok import run_with_ngrok


app = Flask(__name__, template_folder='templates', static_folder='templates/assets')
#run_with_ngrok(app)

def gen_frames():  
    camera = cv2.VideoCapture(0)
    while True:
        _, frame = camera.read()  # read the camera frame
        ret, buffer = cv2.imencode('.jpg', frame)
        if ret == False:
            break
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    config = Utils.getConfigData()
    return render_template('index.html', config=config)

@app.route('/chart_data')
def chart_data():
    chart_data_path = Utils.getConfigData()['chart_data_path']
    try:
        data = Utils.readCSV(chart_data_path)
        print(data)
    except:
        data = []
        print('Error: chart_data_path nao encontrado')
    return data

@app.route('/video_path')
def video_path():
    video_path = Utils.getConfigData()['video_data_path']
    return {'path': video_path}

@app.route('/set_config', methods=['POST'])
def set_config():
    data = request.json['data']
    print(data)
    for item in data:
        Utils.changeConfigFile(item['path'], item['value'])

    return render_template('index.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
