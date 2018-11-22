# Codewars Dashboard App

This app is as a onestop dashboard for viewing a users data from codewars.com.

### Tech

Codewars Dashboard uses a number of open source projects to work properly:

* [Python3] - interpreted high-level programming language
* [Tornado] - Python web framework and asynchronous networking library
* [jQuery] - simplify the client-side scripting of HTML
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [DataTables] - adds advanced features to any HTML table


### Installation

Codewars Dashboard requires
[python3](https://www.python.org/download/releases/3.0/) to run.

Clone the app from [the main repo](https://github.com/Steph-harris/codewars_dashboard).

```sh
$ cd codewars_dashboard

python3 -m venv env
source env/bin/activate
(env) pip install -r requirements.txt
(env) python app.py
```

### Development
To run this app locally, you'll need to create a .env file in the root directory with the following default vars:

```sh
#Codewars API key and other sensitive data
CODEWARS_API_KEY="yourKeyHere"
CODEWARS_URL="https://www.codewars.com/api/v1/"
CODEWARS_USER="SniperWolf421"
```

Your codewars access key can be found at https://www.codewars.com/users/edit under 'API ACCESS TOKEN
'
