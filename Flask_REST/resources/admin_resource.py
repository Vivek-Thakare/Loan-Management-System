from db import mysql
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from flask import jsonify, request
from datetime import timedelta, datetime
import calendar
import datetime as date


class LoanOptions(Resource):
    # API to get the different types of loan applied
    @jwt_required()
    def get(self):
        cursor = mysql.connection.cursor()
        query1 = '''SELECT DISTINCT(loan_type) FROM loan_info '''
        query2 = '''
               SELECT sum(paid_loan) as total_recovered , SUM(total_loan) as total_distributed, 
               MAX(loan_tenure - tenure_completed) as tenure
               FROM loan_info ;'''
        cursor.execute(query1)
        result = cursor.fetchall()
        cursor.execute(query2)
        result2 = cursor.fetchone()
        if result and result2:
            loan_options = []
            for option in result:
                loan_options.append(option['loan_type'])
            loan_options.append('All')
            return jsonify({'status': 'success', 'options': loan_options, "loan_summary": result2})
        else:
            return jsonify({'options': "no data"})


class LoanUsers(Resource):
    # API for List of all user based on the selected loan type
    @jwt_required()
    def get(self):
        option = request.args.get('loantype')
        cur = mysql.connection.cursor()
        if option == "All":
            option = '%'
        # to get all user information with the associated loan type
        try:
            cur.execute('''SELECT * FROM user_info, loan_info 
                            WHERE user_info.user_id = loan_info.user_id AND loan_type LIKE %s;''', [option])
            res1 = cur.fetchall()
            if res1:
                return jsonify({"status": "success", "users": res1})
            else:
                return jsonify({"status": "failed", "users": res1})
        except Exception as e:
            print(e)
            return jsonify({"message": "something went wrong"})


class TransactionStatus(Resource):

    @staticmethod
    def get():
        value = request.args.get('data')
        year = value.split('-')[0]
        month = value.split('-')[1]

        cursor = mysql.connection.cursor()
        query1 = '''SELECT count(*) as count FROM transaction_info
                            WHERE YEAR(date) = %s AND MONTH(date) = %s and status = %s'''
        res = [0, 0, 0]
        cursor.execute(query1, (year, month, 'green'))
        res[0] = cursor.fetchone()['count']
        cursor.execute(query1, (year, month, 'yellow'))
        res[1] = cursor.fetchone()['count']
        cursor.execute(query1, (year, month, 'red'))
        res[2] = cursor.fetchone()['count']

        if res:
            return jsonify({"data": res, 'range': max(res)})
        else:
            return jsonify({"data": "null", 'range': 10})


class Filter(Resource):
    # API to filter the data in the Admin Dashboard
    @staticmethod
    def get():
        search_type = request.args.get("search_type")
        search_key = request.args.get("search_key")
        comparator = request.args.get('comparator')
        loan_type = request.args.get('loantype')
        cursor = mysql.connection.cursor()
        res = ""
        if loan_type == 'All':
            loan_type = '%'
        try:
            if search_type == "Name":
                firstname = search_key
                try:
                    firstname = search_key.split(" ")[0] + '%'
                except Exception as e:
                    print(e)
                lastname = '%'
                try:
                    lastname = search_key.split(" ")[1] + '%'
                except Exception as e:
                    print(e)

                query = '''SELECT * FROM user_info, loan_info 
                            WHERE user_info.user_id=loan_info.user_id 
                            AND loan_info.loan_type LIKE %s AND first_name LIKE %s AND last_name LIKE %s;'''
                cursor.execute(query, (loan_type, firstname, lastname))
                res = cursor.fetchall()

            elif search_type == 'User Id':
                query = '''SELECT * FROM user_info, loan_info 
                               WHERE user_info.user_id= %s AND loan_info.loan_type LIKE %s AND user_info.user_id=loan_info.user_id; '''
                cursor.execute(query, (search_key, loan_type))
                res = cursor.fetchall()


            elif search_type == 'Date Issued':
                query = '''SELECT * FROM user_info, loan_info 
                            WHERE user_info.user_id=loan_info.user_id AND loan_info.loan_type Like  \'''' \
                        + loan_type + '\'  AND  DATE(issue_date)' + comparator + ' \'' + search_key + '\''

                cursor.execute(query)
                res = cursor.fetchall()

            elif search_type == 'Date Issued (Range)':
                search_key = '\'' + search_key + '\''
                search_key1 = '\'' + request.args.get('search_key1') + '\''

                query = '''SELECT * FROM user_info, loan_info 
                               WHERE user_info.user_id=loan_info.user_id AND loan_info.loan_type LIKE  \'''' \
                        + loan_type + '\'  AND DATE(issue_date) BETWEEN ' + search_key + ' AND ' + search_key1

                cursor.execute(query)
                res = cursor.fetchall()

            elif search_type == 'Tenure':
                tenure = search_key
                query = '''SELECT * FROM user_info, loan_info 
                                    WHERE user_info.user_id=loan_info.user_id 
                                    AND loan_info.loan_type LIKE \'''' + loan_type + '\' AND loan_tenure ' \
                        + comparator + '\'' + tenure + '\''
                cursor.execute(query)
                res = cursor.fetchall()


            elif search_type == 'Tenure remaining':
                tenure_remaining = search_key
                query = '''SELECT * FROM user_info, loan_info 
                            WHERE user_info.user_id=loan_info.user_id 
                            AND loan_info.loan_type LIKE \'''' + loan_type + '\' AND ( loan_tenure - tenure_completed )  ' \
                        + comparator + '\'' + tenure_remaining + '\''

                cursor.execute(query)
                res = cursor.fetchall()

            elif search_type == 'Tenure completed':
                tenure_completed = search_key
                query = '''SELECT * FROM user_info, loan_info 
                                       WHERE user_info.user_id=loan_info.user_id AND loan_info.loan_type LIKE \'''' \
                        + loan_type + '\' AND tenure_completed ' + comparator + ' \'' + tenure_completed + '\''
                cursor.execute(query)
                res = cursor.fetchall()

            elif search_type == 'Loan Amount':
                query = '''SELECT * FROM user_info, loan_info 
                                       WHERE user_info.user_id=loan_info.user_id  AND loan_info.loan_type LIKE \'''' \
                        + loan_type + '\' AND total_loan ' + comparator + ' ' + search_key
                cursor.execute(query)
                res = cursor.fetchall()

            elif search_type == 'Loan Paid':
                query = '''SELECT * FROM user_info, loan_info 
                                          WHERE user_info.user_id=loan_info.user_id AND loan_info.loan_type LIKE  \'''' \
                        + loan_type + '\' AND paid_loan ' + comparator + ' ' + search_key
                cursor.execute(query)
                res = cursor.fetchall()

            elif search_type == 'Loan Remaining':
                query = '''SELECT * FROM user_info, loan_info 
                                          WHERE user_info.user_id=loan_info.user_id  AND loan_info.loan_type LIKE  \'''' \
                        + loan_type + '\' AND (total_loan - paid_loan ) ' + comparator + ' ' + search_key
                cursor.execute(query)
                res = cursor.fetchall()
            if res:
                return jsonify({"data": res})
            else:
                return jsonify({"data": "null"})
        except Exception as e:
            print(e)
