# JBapp (John Bryce App)

This is an app to register and approve mechanical spare parts for purchase and inventory management.

It is based on a standard that is shown in the excel file attached to this project folder.

# Usage

To run the project locally, follow these steps:

```bash
git clone https://github.com/YairRiffkin/JBapp
cd JBapp
```

# Create a virtual environment:

```bash
python -m venv .venv
```

Activate the environment:

On windows:

```bash
python -m venv .venv
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

### Backend API server (Flask)

Create your .env file in the /backend directory.

You can copy the example.env file or create your own.

Build the backend dependencies. Make sure to run the following commands in the /backend directory:

```bash
pip install -r requirements.txt
```

> [!WARNING]

> Change the value of the FLASK_SECRET_KEY in the backend/.env file to a random string. This is used to secure the session cookies / JWT tokens.

> The FLASK_TEST is important if you are running tests. If you do not include this the test will affect your “history” table in the SQLITE database.

> The default should be “not_testing” as this is the key the code is looking for.

After that you can run the backend server (inside the backend directory)

```bash
flask run
```

If you need to run the backend tests you first need to install the test / dev dependencies:

```bash
pip install -r requirements-dev.txt
pytest
```

### Frontend (react/Vite/TypeScript)

From within the [frontend](frontend) directory, run the following commands:

```bash
npm install
npm run dev
```

You should be able to access the project at [http://localhost:5173](http://localhost:5173/) in your browser (the port may change, check the output of the npm run dev command).

You can also run the frontend tests:

```bash
npm run test
```

### Database

The backend uses SQLite as the database. The database file is created automatically when the backend server is started. If it didn't, or if you need to reset the database, you can delete the `backend/db/data.db` file and restart the backend server. The database will be recreated.

The app will also create the first admin username for you automatically.

The username is: E74323

The password is: Aa1234

>[WARNING!]

>The initial admin user is created only once, when the database file is created. If you delete the database file, the initial admin user will be created again. 
>It is also highly recommended to change the initial admin password after the first login.
>Without an admin present in the database many of the features cannot be accessed.
>Admin details can changed before activating the app in the [schema file](https://github.com/YairRiffkin/JBapp/blob/main/backend/database/schema.sql), at the bottom of the file.

### Demo data for using the application

# Backend:

From the /backend directory run the file [dbDemo](https://github.com/YairRiffkin/JBapp/blob/main/backend/dbDemo.py).

This will fill the database with items and users at different levels.

# Front end:

I have added a feature in the /newitem page to choose from a list of item data, to save the time for typing in all the details.

The user still needs to enter a few details to complete the form for submission.

### General Explanation

The app is intended to monitor and supervise new item input to the company ERP system.

For This a standard has been written with clear expectations of mandatory data, format ect.

The App deals with 2 aspects:

1) Users -> who can enter the system, and what actions are allowed for each level.

2) Items -> what must be entered, who approves, in what format, unique values ect.

# Users

1) A user can only be a company employee.

2) "user" can only enter new items.

3) "admin" can perform all user actions and is the only person to approve pending requests.

4) Once the item is approved the procurement person ("proc") can allow the item to be registered.

# Items

The standard is attached to this project as an excel file with tables.

From this standard I built the item specifications and forms.

The process is as follows:

1) Registering a new item : status will be "pending".

2) Approval by admin: status will be "proc".

3) Approval by procurement: status will be "final".

The last stage which is not in the scope of this project, is to plant this data in a standard excel sheet in the desired format. This sheet is then uploaded, as-is, to the ERP system.

To simulate this stage i have added the Final List page, where you can see the data elements in correct format and arranged according to the destination excel tables.


