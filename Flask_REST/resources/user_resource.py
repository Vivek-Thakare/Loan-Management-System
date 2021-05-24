from db import mysql
from flask_restful import Resource
from flask import jsonify, request
from flask_jwt_extended import jwt_required


class Mytest(Resource):
    @jwt_required()
    def get(self):
        cur = mysql.connection.cursor()
        query = "SELECT * FROM user_info"
        cur.execute(query)
        res = cur.fetchall()
        return jsonify({"users": res})


class UserProfile(Resource):

    def get(self, uid):
        cursor = mysql.connection.cursor()
        try:
            cursor.execute('''SELECT * FROM user_info 
                              WHERE  user_id = %s;''', str(uid))
            result = cursor.fetchone()
            if result:
                return jsonify({"status": "success", "data": result})
            else:
                return jsonify({"status": "fail", "data": result})
        except Exception as e:
            return jsonify({"message": "something went wrong"})

    @staticmethod
    def put(uid):
        cursor = mysql.connection.cursor()
        data = request.get_json()
        columns = ', '.join(str(x) for x in data.keys())
        try:
            query = '''UPDATE user_info 
                        SET first_name = %s, last_name = %s,  
                            email = %s, mobile = %s, dob = %s,
                            gender = %s, address = %s
                        WHERE user_id = %s;
                            '''
            values = (data['first_name'], data['last_name'],
                      data['email'], data['mobile'], data['dob'],
                      data['gender'], data['address'], str(uid))
            cursor.execute(query, values)
            mysql.connection.commit()
            return jsonify({"message": "updated successfully"})
        except Exception as e:
            return jsonify({"message": "something went wrong"})


class UserLoanOptions(Resource):
    # API to get the applied no of loans of a particular user
    @jwt_required()
    def get(self, uid):
        try:
            cursor = mysql.connection.cursor()
            print(request.cookies.get('refresh_token'))
            cursor.execute('''SELECT loan_type,loan_id,loan_status from loan_info 
                                       WHERE user_id = %s ''',
                           str(uid))
            result = cursor.fetchall()
            if result:
                option_list = []
                for option in result:
                    option_list.append((option['loan_type']))
                return jsonify({"status": "success", "loan_options": result})
            else:
                return jsonify({"status": "fail", "loan_options": null})
        except Exception as e:
            print(e)
            return jsonify({"message": "something went wrong"})


class UserLoanDetails(Resource):
    # user loan information api
    @jwt_required()
    def get(self):
        uid = request.args.get('id')
        loan_id = request.args.get('loanId')
        cursor = mysql.connection.cursor()
        try:
            last_three_transaction = '''
                     select tid,note,paid_amount ,date ,status
                     from transaction_info,loan_info 
                     where loan_info.user_id=%s and loan_info.loan_id=%s and loan_info.loan_id=transaction_info.loan_id 
                     order by tid desc limit 3
                           '''

            cursor.execute('''SELECT * FROM user_info AS user, loan_info AS loan WHERE user.user_id = %s AND 
               loan.loan_id = %s AND user.user_id = loan.user_id ;''',
                           (str(uid), loan_id))
            result = cursor.fetchone()
            cursor.execute(last_three_transaction, (uid, loan_id))
            result2 = cursor.fetchall()
            if result:
                return jsonify({"status": "success", "data": result, 'transaction_history': result2})
            else:
                return jsonify({"status": "fail", "data": result})
        except Exception as e:
            print(e)
            return jsonify({"message": "something went wrong"})
