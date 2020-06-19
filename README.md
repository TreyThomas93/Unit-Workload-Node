# EMSA-Unit-Workload ***RETIRED***
Displays real time unit(ambulance) workload data for EMSA (Emergency Medical Services Authority) Eastern Division (Tulsa, OK).

## Description
This web application collects and displays individual workload data for each unit. <br /><br />
Branches ( V1-V8 ):<br />
SERVER SIDE: Node, Express, Express EJS, Mongoose(MongoDB), PassportJS(Local Strategy)<br />
CLIENT SIDE: HTML5, SCSS, Vanilla Javascript<br />

Branches ( Vue1-Vue2 ):<br />
SERVER SIDE: Node, Express, Mongoose(MongoDB), JWT Web Token<br />
CLIENT SIDE: VueJS, Vuex, Vue-Router<br />

## How It Works
The initial process is that of the data source **undisclosed**.

Entity: Headless Raspberry Pi 4<br />
Process: Runs a python script -> (https://github.com/TreyThomas93/EMSA-Unit-Workload-No-Flask).<br />
&nbsp;&nbsp;-> Job: <br />
&nbsp;&nbsp;&nbsp;1. Listens for csv file.<br />
&nbsp;&nbsp;&nbsp;2. Extracts csv data and formats accordingly.<br />
&nbsp;&nbsp;&nbsp;3. Runs data through a series of classes, achieving Live Workload Data, Historic Workload Data, System Data, and Notifications and Logs.<br />
&nbsp;&nbsp;&nbsp;4. Saves all data to MongoDB Database to be used by web application.<br />

## Give It A Try

Username: admin1234
Password: password!

https://www.unitworkload.net/
