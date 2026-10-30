Write-Host "=== 1. DASHBOARD SUMMARY ==="
$dash = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/footprints/summary"
Write-Host "Total Footprint:" $dash.data.summary.totalFootprint.value $dash.data.summary.totalFootprint.unit
Write-Host "Activities Logged:" $dash.data.summary.activitiesLogged.value
Write-Host "Categories:" ($dash.data.categoryBreakdown | ForEach-Object { "$($_.category): $($_.emission)kg ($($_.percentage)%)" })
Write-Host "Recommendations count:" $dash.data.recommendations.Count
$dash.data.recommendations | ForEach-Object { Write-Host "  -> Title: $($_.title) [$($_.category)] | Action: $($_.action) | Savings: $($_.estimatedSavings)" }

Write-Host "`n=== 2. ACTIVITY HISTORY ==="
$acts = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/activities"
Write-Host "Total Activities:" $acts.summary.totalActivities
Write-Host "Total Emissions:" $acts.summary.totalEmissions $acts.summary.unit
$acts.activities | ForEach-Object { Write-Host "  -> $($_.activity) [$($_.category)] $($_.quantity) $($_.emissions) kg CO2e" }

Write-Host "`n=== 3. ANALYTICS SUMMARY & REDUCTION OPPORTUNITIES ==="
$an = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/analytics/summary"
Write-Host "Total Emissions:" $an.data.totalEmissions
Write-Host "Highest Sector:" $an.data.reductionOpportunities.highestCategory "($($an.data.reductionOpportunities.sharePercentage)%)"
Write-Host "Status:" $an.data.reductionOpportunities.progress.status
$an.data.reductionOpportunities.opportunities | ForEach-Object { Write-Host "  -> Opportunity: $($_.title) | Savings: $($_.estimatedSavings)" }

Write-Host "`n=== 4. CALCULATOR ENDPOINT WITH REDUCTION TIP ==="
$calcBody = @{ activities = @( @{ category = "transportation"; activity_type = "bus"; distance_km = 15; activityName = "City Bus 15 km" } ) } | ConvertTo-Json
$calcRes = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/footprints/calculate" -Method Post -Body $calcBody -ContentType "application/json"
Write-Host "Total Calculated:" $calcRes.data.totalEmissions $calcRes.data.unit
Write-Host "Reduction Tip Title:" $calcRes.data.reductionTip.title
Write-Host "Reduction Tip Explanation:" $calcRes.data.reductionTip.explanation
Write-Host "Reduction Tip Action:" $calcRes.data.reductionTip.action
Write-Host "Reduction Tip Savings:" $calcRes.data.reductionTip.estimatedSavings

Write-Host "`n=== 5. AI CHAT WITH REDUCTION TIP ==="
$chatBody = @{ message = "I traveled 12 km on a bus today" } | ConvertTo-Json
$chatRes = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/chat" -Method Post -Body $chatBody -ContentType "application/json"
Write-Host "Chat Response Type:" $chatRes.response.type
Write-Host "Calculated Emissions:" $chatRes.response.calculation.emissions
Write-Host "Reduction Tip in Chat:" $chatRes.response.reductionTip
