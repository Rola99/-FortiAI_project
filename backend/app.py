from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from model.analyzer import analyze_player

app = Flask(__name__)
CORS(app)

@app.route("/analyze-player", methods=["POST"])
def analyze_manual():
    payload = request.get_json()
    # تأكدي من تحويل القيم إلى عددية إذا جاءت كنصوص
    for key in ['age','weight','height','previousInjuries','trainingIntensity','recoveryDays']:
        payload[key] = float(payload[key])
    result = analyze_player(payload)
    return jsonify(result)

@app.route("/analyze-player", methods=["GET"])
def analyze_auto():
    auto = request.args.get("auto", "false").lower() == "true"
    if not auto:
        return jsonify({"error": "auto parameter missing or false"}), 400
    # بيانات افتراضية يمكنك تعديلها حسب حاجتك
    default_data = {
        "age": 25,
        "weight": 70,
        "height": 175,
        "previousInjuries": 0,
        "trainingIntensity": 1,
        "recoveryDays": 5
    }
    result = analyze_player(default_data)
    return jsonify(result)



@app.route("/analyze-team", methods=["POST"])
def analyze_team():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "file missing"}), 400

    df = pd.read_csv(file)
    results = []
    for _, row in df.iterrows():
        data = {
            'age':           row['Player_Age'],
            'weight':        row['Player_Weight'],
            'height':        row['Player_Height'],
            'previousInjuries':    row['Previous_Injuries'],
            'trainingIntensity':   row['Training_Intensity'],
            'recoveryDays':        row['Recovery_Time']
        }
        res = analyze_player(data)
        # نحول عمود الاسم إلى player_name ليتوافق مع React
        res['player_name'] = row.get('player_Name', f"Player {_}")
        res['recoveryDays'] = data['recoveryDays']  # أضف هذا السطر
        results.append(res)

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
