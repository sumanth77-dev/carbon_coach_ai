import sqlite3

conn = sqlite3.connect('carbon_coach_ai/carbon_coach.db')
cur = conn.cursor()

# Canonicalize existing categories in SQLite
cur.execute("UPDATE activities SET category = 'transportation' WHERE category IN ('transport', 'transit', 'commute')")
cur.execute("UPDATE activities SET category = 'electricity' WHERE category IN ('energy', 'power')")
cur.execute("UPDATE activities SET category = 'food' WHERE category IN ('diet', 'meal')")
conn.commit()

rows = cur.execute("SELECT activity_id, user_id, category, activity_type, kg_co2e, created_at FROM activities").fetchall()
print("Updated Rows:")
for r in rows:
    print(r)
conn.close()
