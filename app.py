import cv2
from flask import Flask, render_template, request, Response
from Utils import Utils

app = Flask(__name__, template_folder='templates', static_folder='templates/assets')

camera = cv2.VideoCapture(0)

def gen_frames():  
    while True:
        success, frame = camera.read()  # read the camera frame
        if not success:
            break
        else:
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
    data = Utils.readCSV(chart_data_path)
    return data

@app.route('/set_config', methods=['POST'])
def set_config():
    data = request.json['data']
    print(data)
    for item in data:
        Utils.changeConfigFile(item['path'], item['value'])

    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
