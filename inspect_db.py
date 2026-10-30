import sqlite3

conn = sqlite3.connect('carbon_coach_ai/carbon_coach.db')
cur = conn.cursor()
print("Count:", cur.execute("SELECT count(1) FROM activities").fetchall())
rows = cur.execute("SELECT activity_id, user_id, category, activity_type, kg_co2e, created_at FROM activities").fetchall()
print("Rows:")
for r in rows:
    print(r)
conn.close()
