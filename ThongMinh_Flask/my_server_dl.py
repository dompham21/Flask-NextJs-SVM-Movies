from flask_cors import CORS, cross_origin
from flask import Flask, json, request, jsonify
from flask_mysqldb import MySQL
import pandas as pd
import re
from underthesea import word_tokenize
import joblib
import bcrypt
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from datetime import datetime, timedelta
mysql = MySQL()
app = Flask(__name__)
# Apply Flask CORS
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# MySQL configurations
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '147258369Dom'
app.config['MYSQL_DB'] = 'movies'
app.config['MYSQL_HOST'] = 'localhost'
app.config['JWT_SECRET_KEY'] = 'secret-secret'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)

mysql.init_app(app)

UPLOAD_FOLDER = 'static/models'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def standardize_data(row):
    # Xóa dấu chấm, phẩy, hỏi ở cuối câu
    row = re.sub(r"[\.,\?]+$-", "", row)

    # Xóa tất cả dấu chấm, phẩy, chấm phẩy, chấm thang, ... trong câu
    row = row.replace(",", " ").replace(".", " ") \
        .replace(";", " ").replace("“", " ") \
        .replace(":", " ").replace("”", " ") \
        .replace('"', " ").replace("'", " ") \
        .replace("!", " ").replace("?", " ") \
        .replace("-", " ").replace("?", " ")
    row = row.strip()
    return row

def tokenizer(row):
    return word_tokenize(row, format="text")

@app.route('/search', methods=['GET'])
@cross_origin(origin='*')
@jwt_required()
def search():
    q = request.args.get('q')
    if q:
        query = "%" +q + "%"
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM movies WHERE name LIKE %s", (query,))

        fields = [field_md[0] for field_md in cursor.description]
        result = [dict(zip(fields, row)) for row in cursor.fetchall()]

        resp = jsonify({'movies': result})
        resp.status_code = 200
        return resp
    else:
        resp = jsonify({'message': 'Bad Request'})
        resp.status_code = 400
        return resp


@app.route('/movies', methods=['GET'] )
@cross_origin(origin='*')
@jwt_required()
def get_list_movies():
    cursor = mysql.connection.cursor()
    cursor.execute( "SELECT * FROM movies")

    fields = [field_md[0] for field_md in cursor.description]
    result = [dict(zip(fields, row)) for row in cursor.fetchall()]

    resp = jsonify({'movies': result})
    resp.status_code = 200
    return resp

@app.route('/movies/<label_comment>', methods=['GET'] )
@cross_origin(origin='*')
@jwt_required()
def get_list_movies_category(label_comment):


    cursor = mysql.connection.cursor()
    cursor.callproc("sp_getMovieCategory", [label_comment])

    fields = [field_md[0] for field_md in cursor.description]
    result = [dict(zip(fields, row)) for row in cursor.fetchall()]

    resp = jsonify({'movies': result})
    resp.status_code = 200
    return resp

@app.route('/movies/detail/<id>', methods=['GET'] )
@cross_origin(origin='*')
@jwt_required()
def get_detail_movies(id):

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM movies WHERE id = % s ", (id,))

    fields = [field_md[0] for field_md in cursor.description]
    movie = dict(zip(fields,  cursor.fetchone()))


    cursor.callproc("sp_getCommentsMovie", [id])

    fields = [field_md[0] for field_md in cursor.description]
    comment = [dict(zip(fields, row)) for row in cursor.fetchall()]

    cursor.close()

    cursor = mysql.connection.cursor()

    cursor.callproc("sp_getCategoryMovie", [id])

    fields = [field_md[0] for field_md in cursor.description]
    categories = [dict(zip(fields, row)) for row in cursor.fetchall()]
    movie['categories'] = categories

    resp = jsonify({'movie': movie, "comments" : comment})
    resp.status_code = 200
    return resp

@app.route('/comment/add', methods=['POST'])
@cross_origin(origin='*')
@jwt_required()
def add_comment():
    user = get_jwt_identity()
    email = user['email']

    comment = request.json.get('comment', None)
    movie_id = request.json.get('movie_id', None)

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM movies WHERE id = % s ", (movie_id,))
    fields = [field_md[0] for field_md in cursor.description]
    movie = dict(zip(fields, cursor.fetchone()))

    if not movie:
        resp = jsonify({'message': 'Movie Not Found'})
        resp.status_code = 404
        return resp

    cursor.execute('SELECT * FROM users WHERE email = % s', (email,))
    fields = [field_md[0] for field_md in cursor.description]
    account = dict(zip(fields, cursor.fetchone()))

    if not account:
        resp = jsonify({'message': 'Account Not Found'})
        resp.status_code = 404
        return resp

    data_frame = pd.DataFrame([comment])
    data_frame[0] = data_frame[0].apply(standardize_data)

    # 3. Tokenizer
    data_frame[0] = data_frame[0].apply(tokenizer)

    path = app.config['UPLOAD_FOLDER']

    # Load tfidf
    emb = joblib.load(path + '/tfidf.pkl')
    X_val = emb.transform(data_frame[0])

    # Load model
    model = joblib.load(path + '/model.pkl')

    label = model.predict(X_val)

    cursor.execute('INSERT INTO comments(comment,movie_id, user_id, label, date) VALUES (% s, % s, % s, % s, % s)',
                   (comment, movie_id, account["id"], label[0], datetime.today().strftime('%Y-%m-%d')))
    mysql.connection.commit()
    resp = jsonify({'message': "Your comment has been created successfully!"})
    resp.status_code = 200
    return resp

@app.route('/register', methods=['POST'])
@cross_origin(origin='*')
def register():
    try:
        email = request.json.get('email', None)
        name = request.json.get('name', None)
        password = request.json.get('password', None)
        if not email:
            resp = jsonify({'message': 'Missing email'})
            resp.status_code = 400
            return resp
        if not password:
            resp = jsonify({'message': 'Missing password'})
            resp.status_code = 400
            return resp
        if not name:
            resp = jsonify({'message': 'Missing name'})
            resp.status_code = 400
            return resp

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor = mysql.connection.cursor()

        cursor.execute('SELECT * FROM users WHERE email = % s', (email, ))
        account = cursor.fetchone()
        if account:
            resp = jsonify({'message': 'Account already exists'})
            resp.status_code = 400
            return resp
        cursor.execute('INSERT INTO users(email,name, password, created_at) VALUES (% s, % s, % s, % s)', (email, name, hashed, datetime.today().strftime('%Y-%m-%d')))
        mysql.connection.commit()
        access_token = create_access_token(identity={"email": email})
        resp = jsonify({'access_token': access_token})
        resp.status_code = 200
        return resp

    except AttributeError:
        resp = jsonify({'message': 'Provide an Email and Password in JSON format in the request body'})
        resp.status_code = 400
        return resp


@app.route('/login', methods=['POST'])
@cross_origin(origin='*')
def login():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)

        if not email:
            resp = jsonify({'message': 'Missing email'})
            resp.status_code = 400
            return resp
        if not password:
            resp = jsonify({'message': 'Missing password'})
            resp.status_code = 400
            return resp

        cursor = mysql.connection.cursor()

        cursor.execute('SELECT * FROM users WHERE email = % s', (email, ))
        fields = [field_md[0] for field_md in cursor.description]
        account = dict(zip(fields, cursor.fetchone()))

        if not account:
            resp = jsonify({'message': 'Account Not Found'})
            resp.status_code = 404
            return resp

        if bcrypt.checkpw(password.encode('utf-8'), account["password"].encode('utf-8')):
            access_token = create_access_token(identity={"email": email})
            resp = jsonify({'access_token': access_token})
            resp.status_code = 200
            return resp
        else:
            resp = jsonify({'message': 'Invalid email or password!'})
            resp.status_code = 400
            return resp

    except AttributeError:
        resp = jsonify({'message': 'Provide an Email and Password in JSON format in the request body'})
        resp.status_code = 400
        return resp

# Start Backend
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='6868')
