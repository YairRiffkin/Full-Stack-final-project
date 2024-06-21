John Bryce Full Stack Project

This is an app to register and approve mechanical spare parts for purchase and inventory management.

It is based on a standard that is shown in the excel file attached to this project folder.

Usage

To run the project locally, follow these steps:

git clone https://github.com/YairRiffkin/Full-Stack-final-project

cd Full-Stack-final-project

Backend API server (Flask)

Build the backend dependencies. Make sure to run the following commands in the backend directory (and it's recommended to use a virtual environment):

pip install -r requirements.txt

WARNING!

Change the value of the FLASK_SECRET_KEY in the backend/.env file to a random string. This is used to secure the session cookies / JWT tokens.

After that you can run the backend server (inside the backend directory

flask run

If you need to run the backend tests you first need to install the test / dev dependencies:

pip install -r requirements-dev.txt

pytest

Frontend (react/Vite/TypeScript)

From within the [frontend](https://github.com/YairRiffkin/Full-Stack-final-project/tree/main/frontend) directory, run the following commands:

npm install

npm run dev

You should be able to access the project at [http://localhost:5173](http://localhost:5173/) in your browser (the port may change, check the output of the npm run dev command).

You can also run the frontend tests:

npm run test

Database

The backend uses SQLite as the database. The database file is created automatically when the backend server is started. If it didn't, or if you need to reset the database, you can delete the backend/db/data.db file and restart the backend server. The database will be recreated.

The app will also create the first admin username for you automatically.

The username is: E74323

The password is: Aa1234

WARNING!

The initial admin user is created only once, when the database file is created. If you delete the database file, the initial admin user will be created again. It is also highly recommended to change the initial admin password after the first login.

Demo data for using the application

Backend:

From the /backend directory run the file [dbDemo](https://github.com/YairRiffkin/Full-Stack-final-project/blob/main/backend/dbDemo.py).

This will fill the database with items and users at different levels.

Front end:

I have added a feature in the /newitem page to choose from a list of item data, to save the time for typing in all the details.

The user still needs to enter a few details to complete the form for submission.
