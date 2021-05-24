from flask import Flask, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager
import db
from db import mysql
from datetime import timedelta
from resources.user_resource import Mytest, UserProfile, UserLoanDetails, UserLoanOptions
from resources.authenticate import Authenticate, TokenRefresh
from resources.admin_resource import LoanUsers, TransactionStatus, LoanOptions, Filter
from resources.loan_resource import ApplyForLoan, PaymentGateway


app = Flask(__name__)
app.config['MYSQL_HOST'] = db.MYSQL_HOST
app.config['MYSQL_USER'] = db.MYSQL_USER
app.config['MYSQL_PASSWORD'] = db.MYSQL_PASSWORD
app.config['MYSQL_DB'] = db.MYSQL_DB
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JWT_SECRET_KEY'] = "Re@per"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)  # can be minutes and hours, access_token expiration time
# app.config['JSON_SORT_KEYS'] = False

api = Api(app)
mysql.init_app(app)
jwt = JWTManager(app)


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'message': 'sorry...this token has expired'
    }), 401


@jwt.invalid_token_loader
def invalid_token_callback(jwt_error):
    return jsonify({
        "description": "Signature verification failed",
        "error": "invalid token"
    }), 401


@jwt.unauthorized_loader
def unauthorized_loader_callback(jwt_error):
    return jsonify({
        "description": "Token verification needed(no token received)"
    }), 401


api.add_resource(Mytest, '/test')
api.add_resource(Authenticate, '/authenticate')
api.add_resource(TokenRefresh, '/refresh')
api.add_resource(LoanOptions, '/getAppliedLoanOptions')
api.add_resource(LoanUsers, '/getUsers')
api.add_resource(TransactionStatus, '/getTransactionStatus')
api.add_resource(Filter, '/filterSearch')
api.add_resource(ApplyForLoan, '/applyForLoan/<uid>')
api.add_resource(PaymentGateway, '/payLoan')
api.add_resource(UserProfile, '/userProfile/<uid>')
api.add_resource(UserLoanOptions, '/getUserLoanOptions/<uid>')
api.add_resource(UserLoanDetails, '/getUserLoanDetails')

if __name__ == '__main__':
    app.run(debug=True)
