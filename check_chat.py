import requests

res = requests.post('http://localhost:5000/api/v1/chat', json={'message': 'I traveled 12 km on a bus today'})
print("Status:", res.status_code)
data = res.json()
print("Keys:", data.keys())
resp = data.get('response', {})
print("Type:", resp.get('type'))
print("Calculation:", resp.get('calculation'))
print("ReductionTip:", resp.get('reductionTip'))
print("Content:\n", resp.get('content'))
