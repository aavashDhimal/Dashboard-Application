Dashboard Application

This Application is build using NodeJs as a backend and React for Frontend. I have used ElasticUI libary to design the dashboard and ChartsJs to generate  charts for the dashboard. I did tried to implement Elastic Search  Database but due to limited time I stuck with Mongo DB.


------------------------------------------------------------------------------------------------- 
Project Setup :
-Clone the Project from the github repository
-go to the backend folder and add .env(provided in the mail) MONGO_URL,PORT="4040" AND SECRETE_KEY 
-on a cli cd to backend and do yarn add(preferred) or npm install.
-cd to the frontend and do yarn add
-after packages are completed do yarn start on both frontend and backend
-Create a .env file on backend with the data given below : 




I have installed nodemon in backend as dev dependency and used it to run the backend.
Also The frontend will run on port 300 by default
In this Dashboard Application You Can Find

------------------------------------------------------------------
Frontend :
-User Can Login as admin,nginx or apache
-Total number of events
- Most active IP Address
- Most commonly used HTTP Request In Pie Chart
 -Bar Chart that shows number of event with respect to time
 -Http Status Code 
 -Response size With respect to time in a line graph
 -User agent Table
 -Table with time and corresponding raw log data
 
----------------------------------------------------
Backend :
-Backend Is implemented using NodeJs with Express and RESTful API
-I have used Moongoose for ODM.
-The admin has access to all data whereas nginx and apache users are only give their respective data.
-The github repo file is read using axios and parsed dbefore sending to the database in a structured format.
-You Can Find Detailed APIs in the postman file.
------------------------
Database : 
I choose to use MongoDB as the database, while I also gave a little bit of time to explore Elastic Search.
I have made only two collections in the database for users and log datas. 
The database is hosted on the free tier Service Provided by MONGO ATLAS.


