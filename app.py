import cv2
from flask import Flask, render_template, request, Response, redirect, url_for
from Utils import Utils
from flask_login import login_user, logout_user, login_required, LoginManager


app = Flask(__name__, template_folder='templates', static_folder='templates/assets')
app.config['SECRET_KEY'] = 'camera-secret'
login_manager = LoginManager()
login_manager.login_view = '/login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return Utils.getUserById(user_id)

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
@login_required
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
@login_required
def index():
    config = Utils.getConfigData()
    return render_template('index.html', config=config)

@app.route('/chart_data')
@login_required
def chart_data():
    chart_data_path = Utils.getConfigData()['chart_data_path']
    try:
        data = Utils.readCSV(chart_data_path)
    except:
        data = []
        print('Error: chart_data_path nao encontrado')
    return data

@app.route('/video_path')
@login_required
def video_path():
    video_path = Utils.getConfigData()['video_data_path']
    return {'path': video_path}

@app.route('/set_config', methods=['POST'])
@login_required
def set_config():
    data = request.json['data']
    for item in data:
        Utils.changeConfigFile(item['path'], item['value'])

    return render_template('index.html')


@app.route('/login')
def login_get():
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/login")


@app.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    user = Utils.getUser(username, password)
    print(remember)
    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user:
        return redirect('login?error=True') # if the user doesn't exist or password is wrong, reload the page

    # if the above check passes, then we know the user has the right credentials
    login_user(user, remember=remember)
    return redirect("/")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
