from db import mysql
from flask_restful import Resource
from flask import jsonify, request, after_this_request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity


class Authenticate(Resource):
    @staticmethod
    def get():
        cur = mysql.connection.cursor()
        print("get request to authenticate login")
        username = request.args.get('user_name')
        password = request.args.get('password')
        _type = request.args.get('type')
        _id = None
        if _type == 'Admin':
            query = ''' select user_name,id,password from admin_info where user_name = %s OR email = %s'''
            cur.execute(query, (username, password))
            res = cur.fetchone()
            _id = res['id']
        else:
            query = ''' select user_name,user_id,password from user_info where user_name = %s OR email = %s'''
            cur.execute(query, (username, password))
            res = cur.fetchone()
            _id = res['user_id']

        if res:
            if res['password'] == password:
                token = create_access_token(identity=_id, fresh=True)
                refresh = create_refresh_token(_id)
                print('authentication completed, Correct username and password ')
                response = jsonify({"access_token": token, "login": True, "id": _id,
                                    'user_name': res['user_name']})
                response.status_code = 200
                response.set_cookie('refresh_token', refresh, secure=True, httponly=True, samesite='Strict')
                return response

            else:
                return jsonify({"login": False})
        else:
            return jsonify({"login": False})

    @staticmethod
    def post():
        cursor = mysql.connection.cursor()
        data = request.get_json()
        values = [x.strip() for x in data.values()]
        try:
            cursor.execute('''SELECT user_id FROM user_info 
                                       WHERE first_name = %s AND last_name = %s''', (values[0], values[1]))
            result = cursor.fetchone()
            if result is None:
                query = '''INSERT INTO user_info (first_name, last_name, mobile, email, address, gender, dob, user_name, password)
                                       VALUES %s;'''
                cursor.execute(query, [values])
                mysql.connection.commit()
                return jsonify({"message": "registered successfully"})
            else:
                return jsonify({"message": "Already Registered"})
        except Exception as e:
            print(e)
            return jsonify({"message": "something went wrong"})


class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        curr_id = get_jwt_identity()
        access_token = create_access_token(curr_id, fresh=False)
        return {
            "access_token": access_token
        }
