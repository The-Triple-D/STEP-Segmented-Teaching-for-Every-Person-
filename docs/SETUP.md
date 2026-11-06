# BACKEND

# Developer Setup Guide

Everyone on the team follows these steps once on their own device. Each person runs their **own local copy** of the database, so the same settings work on every machine.

> Never commit passwords, `.env` files, or `target/` and `node_modules/` folders.

## 1. Install the tools

| Tool | Notes |
|---|---|
| Git | https://git-scm.com (accept the defaults) |
| VS Code | https://code.visualstudio.com |
| JDK 17 or higher | Eclipse Temurin from https://adoptium.net. Tick "Set JAVA_HOME" and "Add to PATH" |
| Node.js LTS (20+) | https://nodejs.org (includes npm) |
| MySQL Server 8.x **or** XAMPP | See step 4 |
| MySQL Workbench or phpMyAdmin | To run SQL and view tables |
| Postman | To test the API |

Maven is not needed. The project includes `mvnw`, which downloads it.

Open a **new** PowerShell window and check:

```powershell
git --version
java -version
node -v
npm -v
```

Java must be 17 or higher and Node 20 or higher.

**VS Code extensions:** Extension Pack for Java, Spring Boot Extension Pack, ESLint.

## 2. Set up Git

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

Use the email tied to your GitHub account so your commits are credited to you. You must be added as a collaborator on the repo. Sign in to GitHub when the browser prompts you.

## 3. Clone the repository

Use a short folder path with no spaces if possible:

```powershell
cd C:\Projects
git clone https://github.com/dinjaker-lang/STEP-Segmented-Teaching-for-Every-Person-.git
cd STEP-Segmented-Teaching-for-Every-Person-
code .
```

## 4. Set up MySQL

Use **one** of these:

- **MySQL Server (installed with MySQL Workbench):** make sure the `MySQL80` service is running (`Win + R`, `services.msc`).
- **XAMPP:** open the Control Panel and click **Start** next to MySQL.

If XAMPP says port 3306 is in use, another MySQL is already running. Use that one, or stop its service in `services.msc` before starting XAMPP's.

### Create the database and user

Open Workbench (or phpMyAdmin, SQL tab), connect as `root`, and run:

```sql
CREATE DATABASE IF NOT EXISTS stepdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'STEP'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD';
GRANT ALL PRIVILEGES ON stepdb.* TO 'STEP'@'localhost';
FLUSH PRIVILEGES;
```

Replace `YOUR_PASSWORD` with the team's shared development password. **Ask a teammate for it in the group chat. Do not put it in the repo.** The username `STEP` is case-sensitive.

Tables are created automatically when the backend starts.

## 5. Set the environment variables

Run these once in PowerShell, then **close and reopen VS Code** so new terminals pick them up:

```powershell
setx DB_USERNAME "STEP"
setx DB_PASSWORD "YOUR_PASSWORD"
```

To use them in the current terminal only:

```powershell
$env:DB_USERNAME="STEP"
$env:DB_PASSWORD="YOUR_PASSWORD"
```

Check with `echo $env:DB_USERNAME`. It should print `STEP`.

## 6. Run the backend

```powershell
git checkout main
git pull origin main
cd src\backend
.\mvnw spring-boot:run
```

The first run downloads dependencies and can take a few minutes. Wait for `Started StepApplication`, then open:

http://localhost:8080/api/hello

You should see **STEP backend is running**. Keep the terminal open while you work, and stop the server with `Ctrl+C`.

Java package for all backend code: `com.csit321G6.tripleD.step`. Every new Java file must start with this exact package line, including the capital letters.

## 7. Run the frontend

Once the frontend has been merged into `main`:

```powershell
cd src\frontend
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). Copy `.env.example` to `src/frontend/.env` if it is not there. By default the frontend uses sample data (`VITE_USE_MOCK=true`). Set it to `false` to use the real backend.

## 8. Team workflow

- Never commit directly to `main`.
- One branch per task, named after the ClickUp ID: `feature/<id>-<short-name>` or `fix/<id>-<short-name>`, for example `feature/chk-01-segment-crud`.
- Create each branch from the latest `main`:

```powershell
git checkout main
git pull origin main
git checkout -b feature/chk-01-segment-crud
```

- Use descriptive commit messages that start with the task ID, for example `CHK-01: add Segment CRUD`.
- Open a pull request and get at least one teammate to review it before merging.
- Delete the branch after merging.
- Run `git status` before every commit and check that no `.env`, `target/` or `node_modules/` files are listed.

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `Access denied for user 'root'@'localhost' (using password: NO)` | The environment variables are not set in this terminal. Run the `$env:` lines from step 5, or reopen VS Code after `setx` |
| `Access denied for user 'STEP'` | Wrong password, or the user was not created. Re-run the SQL in step 4 |
| `Unknown database 'stepdb'` | Create the database (step 4) |
| `Communications link failure` | MySQL is not running. Start the service or XAMPP |
| `Port 8080 already in use` | Close the other app that uses it, or stop the old backend |
| `mvnw is not recognized` | Run `.\mvnw` from inside `src\backend` |
| `localhost refused to connect` | The backend is not running. Start it and keep the terminal open |
| `cannot find symbol` or package errors | The `package` line does not match `com.csit321G6.tripleD.step` |
| PowerShell blocks npm scripts | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Java version error | Install JDK 17 or higher and make sure it is first in PATH |

## 10. Checklist

- [ ] Git, VS Code, JDK, Node, MySQL, Workbench and Postman installed
- [ ] `git --version`, `java -version`, `node -v` all work
- [ ] Git name and email set
- [ ] Repo cloned and opened in VS Code
- [ ] `stepdb` database and `STEP` user created
- [ ] `DB_USERNAME` and `DB_PASSWORD` set
- [ ] `http://localhost:8080/api/hello` shows "STEP backend is running"
