import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:5000/api/v1/chat',
    data=json.dumps({'message': 'I rode a bus for 12 km today'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        res_json = json.loads(resp.read().decode('utf-8'))
        print("Success:", res_json.get('success'))
        print("Reply:", res_json.get('response', {}).get('content'))
        print("Calculation:", res_json.get('response', {}).get('calculation'))
        print("ReductionTip:", res_json.get('response', {}).get('reductionTip'))
except urllib.error.HTTPError as e:
    err_body = e.read().decode('utf-8')
    print("HTTP Error:", e.code, err_body)
except Exception as ex:
    print("Error:", ex)
