import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# https://maps.googleapis.com/maps/api/geocode/json?address=University+of+Southern+California+CA&key=YOUR_API_KEY
googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?'
# https://api.tomorrow.io/v4/timelines?location=[LAT,LONG]&fields=[FIELD_NAME]&timesteps=current&units=[UNIT]&timezone=[TIME_ZONE]&apikey=[API_KEY]
tomorrowURL = 'https://api.tomorrow.io/v4/timelines?'
# https://ipinfo.io/?token=YOUR_TOKEN_ID
ipinfoURL = 'https://ipinfo.io/'

googleToken = 'AIzaSyByFWulEuViLSSuww_AmiDnoaW2k4Dr5Y0'
tomorrowToken = 'SAKfPhLE8P0sgbIA1wRQWZGfojFEAIpu'
ipinfoToken = '5c7fe4a056fa90'

@app.route('/')
def index():
   print('Request for index page received')
   return render_template('index.html')

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "This is a test response!"}), 200

@app.route('/geocode', methods=['POST'])
def geocode():
    try:
        data = request.get_json()

        if 'address' not in data:
            return jsonify({"error": "Address field is missing"}), 400
        
        address = data['address']
        
        response = requests.get(googleURL, params={
            'address': address,
            'key': googleToken
        })
        
        if response.status_code == 200:
            ipinfo_data = response.json()
            
            if ipinfo_data:
                print(str(ipinfo_data))
                return jsonify(ipinfo_data), 200
            else:
                print("No data found for the provided address")
                return jsonify({"error": "No data found for the provided address"}), 404
        else:
            print("Failed to fetch data from the geocoding API")
            return jsonify({"error": "Failed to fetch data from the geocoding API"}), 500
    
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
        
@app.route('/tomorrow', methods=['POST'])
def tomorrow():
    try:
        data = request.get_json()

        if 'loc' not in data:
            return jsonify({"error": "loc field is missing"}), 400
        
        response = requests.get(tomorrowURL, params={
            'location': data['loc'],
            'fields': data['fields'],
            'timesteps': data['ts'],
            'units': data['units'],
            'timezone': data['tz'],
            'apikey': tomorrowToken
        })
        
        print(response.json())
        
        if response.status_code == 200:
            ipinfo_data = response.json()
            
            if ipinfo_data:
                print(str(ipinfo_data))
                return jsonify(ipinfo_data), 200
            else:
                print("No data found for the provided address")
                return jsonify({"error": "No data found for the provided address"}), 404
        else:
            print("Failed to fetch data from the geocoding API")
            return jsonify({"error": "Failed to fetch data from the geocoding API"}), 500
    
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
        
@app.route('/ipinfo', methods=['POST'])
def ipinfo():
    try:
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        client_ip = client_ip.split(":")[0]
        print(str(client_ip))
        
        response = requests.get(ipinfoURL + client_ip + "?", params={
            'token': ipinfoToken
        })
        
        if response.status_code == 200:
            ipinfo_data = response.json()
            
            if ipinfo_data:
                print(str(ipinfo_data))
                return jsonify(ipinfo_data), 200
            else:
                print("No data found for the provided address")
                return jsonify({"error": "No data found for the provided address"}), 404
        else:
            print("Failed to fetch data from the geocoding API")
            return jsonify({"error": "Failed to fetch data from the geocoding API"}), 500
    
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run()