from db import mysql
from flask_restful import Resource
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from datetime import timedelta, datetime
import calendar
import datetime as date


class ApplyForLoan(Resource):
    # @app.route('/applyForLoan/<int:uid>', methods=['POST'])
    @jwt_required()
    def post(self, uid):
        data = request.json
        total_loan = int(data['loan_amount'])
        loan_type = data['loan_type']
        tenure = int(data['tenure'])
        cur = mysql.connection.cursor()
        cur.execute('''SELECT loan_id FROM loan_info 
            WHERE user_id = %s and loan_type = %s and loan_status = 'active' ''', (str(uid), loan_type))
        result = cur.fetchone()
        if result is None:
            print(total_loan, tenure, loan_type, uid)
            # to assign interest rate from loan type
            if loan_type == 'Personal Loan':
                interest_rate = 17
            elif loan_type == 'Home Loan':
                interest_rate = 7
            elif loan_type == 'Car Loan':
                interest_rate = 9
            # to calculate monthly installment amount

            # installment_amt = round((total_loan + (total_loan * interest_rate * tenure) / 100) / (tenure * 12), 2)
            installment_amt = round((total_loan / tenure), 2)

            print(installment_amt)

            # to find First Installment Due date
            today = datetime.today()
            if today.month == 12:
                new_date = date.datetime(today.year + 1, 1, 31)
            else:
                last_day_of_month = calendar.monthrange(today.year, today.month + 1)[1]
                new_date = date.datetime(today.year, today.month + 1, last_day_of_month)
            installment_due_date = new_date.strftime("%Y-%m-%d")
            print(installment_due_date, 'installment date')

            # query to insert into loan table
            try:
                query = '''
                        INSERT into loan_info (`user_id`, `loan_type`, `total_loan`, `loan_tenure`,`interest_rate`, `installment_amt`, `installment_due_date`)
                        VALUES(%s,%s,%s,%s,%s,%s,%s)
                    '''
                values = (str(uid), loan_type, str(total_loan), str(tenure), str(interest_rate), str(installment_amt),
                          installment_due_date)
                cur.execute(query, values)
                mysql.connection.commit()
                return jsonify({'status': True, 'msg': 'Successfully Applied'})

            except Exception as e:
                return jsonify({'status': False, 'msg': 'something went wrong, Can\'t apply for loan'})
        else:
            return jsonify({'status': False, 'msg': "you have already applied for this loan"})


class PaymentGateway(Resource):
    # api to pay and make information changes according to payment in database
    @staticmethod
    def get():
        uid = request.args.get('uid')
        lid = request.args.get('lid')
        amount = request.args.get('amount')
        payment_type = request.args.get('type')
        print(uid, lid, amount)
        cur = mysql.connection.cursor()

        # to get remaining loan of particular user
        query1 = '''SELECT paid_loan ,total_loan , installment_due_date
                 from loan_info 
                 WHERE loan_info.user_id=%s and loan_info.loan_id=%s'''
        # to update remaining loan into database after subtracting payment amount from previous remaining
        query2 = '''
                UPDATE loan_info
                SET paid_loan = %s , tenure_completed = tenure_completed + 1 ,installment_due_date=%s
                WHERE user_id=%s and loan_id=%s
        '''
        query3 = '''
            INSERT into transaction_info (user_id,loan_id, note, paid_amount,status) 
            VALUES(%s,%s,"installment money " , %s,%s)

            '''
        query4 = '''
                 UPDATE loan_info 
                 SET loan_status="closed" ,paid_loan=total_loan , tenure_completed = loan_tenure, installment_due_date= 'null'
                 where user_id = %s and loan_id = %s

                '''

        cur.execute(query1, (str(uid), str(lid)))
        res1 = cur.fetchone()
        new_paid_loan = float(res1['paid_loan']) + float(amount)  # adding payment amount to paid loan amount
        # to set transaction status
        due_date = date.datetime.strptime(res1['installment_due_date'], '%Y-%m-%d')
        today = date.datetime.now()
        print('------------------------------------------------------Payment data to store in transaction')
        print(today, 'day', today.day, 'month', today.month, 'year', today.year)
        print(due_date, 'installment due date ', due_date.day, type(due_date))
        if today.year == due_date.year:
            if today.month < due_date.month:
                transaction_status = 'green'
                print('green1')
            elif today.month == due_date.month:
                if today.day <= 15:
                    transaction_status = 'green'
                    print('green2')
                elif today.day <= due_date.day:
                    transaction_status = 'yellow'
                    print('yellow1')
                else:
                    transaction_status = 'red'
                    print('red1')
            else:
                transaction_status = 'red'
        elif today.year < due_date.year:
            transaction_status = 'green'
        else:
            transaction_status = 'red'
            print('red3')

        # code to calculate next installment date
        db_date = res1['installment_due_date']
        date_time_obj = date.datetime.strptime(db_date, '%Y-%m-%d')

        if date_time_obj.month == 12:
            new_installment_date = date.datetime(date_time_obj.year + 1, 1, 31)
        else:
            last_day_of_month_2 = calendar.monthrange(date_time_obj.year, date_time_obj.month + 1)[1]
            new_installment_date = date.datetime(date_time_obj.year, date_time_obj.month + 1, last_day_of_month_2)

        new_due_date = new_installment_date.strftime("%Y-%m-%d")
        print(new_paid_loan)
        if int(res1['total_loan']) == int(new_paid_loan):
            print('loan closed')
            msg = 'loan closed and amount of ' + str(amount) + ' Rs paid'
            cur.execute(query4, (str(uid), str(lid)))

        else:
            msg = 'amount of ' + str(amount) + ' Rs Paid'
        print(type)
        if payment_type == 'installment':
            cur.execute(query2, (new_paid_loan, new_due_date, uid, lid))
        # to update transaction information into transaction table

        cur.execute(query3, (str(uid), str(lid), str(amount), transaction_status))
        mysql.connection.commit()

        return jsonify({'data': [uid, lid, amount], 'msg': msg})
