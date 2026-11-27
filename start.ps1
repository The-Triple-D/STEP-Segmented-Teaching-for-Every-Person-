# Start Spring Boot backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\backend'; .\mvnw spring-boot:run"

# Start React frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\src\frontend'; npm run dev"