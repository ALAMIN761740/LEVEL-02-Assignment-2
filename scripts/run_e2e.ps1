# E2E test script for DevPulse API (PowerShell)
# Usage: set $env:BASEURL = 'http://localhost:5000' and run in PowerShell

if (-not $env:BASEURL) {
  Write-Host "Please set BASEURL environment variable, e.g. $env:BASEURL='http://localhost:5000'" -ForegroundColor Yellow
  exit 1
}

$base = $env:BASEURL

Write-Host "1) Signup"
$signup = Invoke-RestMethod -Method Post -Uri "$base/api/auth/signup" -ContentType 'application/json' -Body (@{name='Test User'; email='test+e2e@devpulse.com'; password='password123'; role='contributor'} | ConvertTo-Json)
$signup | ConvertTo-Json -Depth 5

Write-Host "2) Login"
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -ContentType 'application/json' -Body (@{email='test+e2e@devpulse.com'; password='password123'} | ConvertTo-Json)
$token = $login.data.token
Write-Host "Token: $token"

Write-Host "3) Create Issue"
$create = Invoke-RestMethod -Method Post -Uri "$base/api/issues" -ContentType 'application/json' -Headers @{ Authorization = $token } -Body (@{title='E2E: sample'; description='E2E test description at least 20 chars'; type='bug'} | ConvertTo-Json)
$create | ConvertTo-Json -Depth 5

Write-Host "4) Get All Issues"
$all = Invoke-RestMethod -Method Get -Uri "$base/api/issues"
$all | ConvertTo-Json -Depth 5

Write-Host "5) Update Issue (if created)"
if ($create.data -and $create.data.id) {
  $id = $create.data.id
  $upd = Invoke-RestMethod -Method Patch -Uri "$base/api/issues/$id" -ContentType 'application/json' -Headers @{ Authorization = $token } -Body (@{title='E2E: updated'} | ConvertTo-Json)
  $upd | ConvertTo-Json -Depth 5
}

Write-Host "6) Delete Issue (will fail for contributor - expected)"
if ($create.data -and $create.data.id) {
  $id = $create.data.id
  $del = Invoke-RestMethod -Method Delete -Uri "$base/api/issues/$id" -Headers @{ Authorization = $token } -ErrorAction SilentlyContinue
  if ($?) { $del | ConvertTo-Json -Depth 5 } else { Write-Host "Delete failed (expected for contributor)" }
}
