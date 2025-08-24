# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Download and install Android Studio

   ```bash
   https://developer.android.com/studio
   when installing Android Studio, make sure that the following items are checked:
   *Android SDK
   *Android SDK Platform
   *Android Virtual Device
   ```

2. Open the LatticeTakeHomeAssignment folder with Android Studio

3. Inside Android Studio, open up the Terminal with Alt+F12 or click on 
the Terminal button the side bar to the left (second to last at the bottom)

4. Install dependencies by typing the following in the Terminal:

   ```bash
   npm install
   ```
   
5. On the side bar to the right, go to "Device Manager". Alternatively, you can also simply download
 the "Expo Go" app on your phone, then run
   ```bash
   npx expo start
   ```
on the terminal and use either your phone's camera or the Expo Go app's QR scanner to scan
the QR code and run the it on your phone through Expo Go. You may ignore step 6 to 8 if you
decided to run this app through Expo Go on your phone.

6. If possible, start up an existing Virtual Device with the play button, 
if not Click on "Add a new device", then "Create Virtual Device", 
then click on "Medium Phone", then "Next" on the bottom right, 
then "Finish" on the bottom right. Once you've created a Medium Phone Virtual Device,
start it up by clicking on the play button.

7. Once the Medium Phone Virtual Device is running, you can start the app by 
typing the following in the Terminal:

   ```bash
   npx expo start
   ```

8. When you see "Logs for your project will appear below. Press Ctrl+C to exit." in the Terminal
You may press 'a' inside the terminal to start up the app in the Medium Phone Virtual Device.
press 'r' inside the terminal to reload the app if it doesn't start after it finished bundling.

9. press Ctrl+C inside the Terminal to exit.


video demo:
https://youtube.com/shorts/bNuNUgd4b2E

video demo 2, showcasing the overflowing of widgets in the dashboard page:
https://youtube.com/shorts/IfEjP8rrR4A

video demo 3, showcasing the updated UI/UX and toggle light/dark theme:
https://www.youtube.com/shorts/G6j3T1oL6dM

video demo 4, updated message bubbles and widgets with shadows and changed the dashboard picker into a segmentedbutton:
https://youtube.com/shorts/keibGguZnis

video demo 5, updated AI response card to blend into the background:
https://youtube.com/shorts/ES3Z_2sKha8

video demo FINAL, showcases the core functionalities with all the updated UI/UX:
https://youtube.com/shorts/_mIpbx_yUxo

## Features:

The layout of this app features two tabs, an AI conversation page and a dashboard page. 
To navigate between the two pages, simply press on the tabs at the bottom.
The AI conversation page features a basic chat window as with most AI conversation pages. It
also has a side bar where you could add new threads, delete old threads, or edit thread titles.
The Dashboard page allows for the adding and deleting of dashboards, and each dashboard allows
for the adding and deleting of widgets in the form of line charts.

## UI/UX decisions:

UI/UX designs are not my strong suit, in fact, I highly suspect that I may have 
zero aesthetic sense for these sort of things. 
The UI/UX of this app are basic and simple, but more importantly to me,
they're functional. Want to navigate to the dashboard page? simply click on the dashboard tab
at the bottom. Want to add/delete a dashboard or widget? simply click on the add/delete button.
Same goes for the threads in the AI conversation page. Want to add/edit/delete a thread? simply
click on the add/edit/delete button.

## Architecture Notes:

Nothing special when it comes to component structures, mostly just the basic components from 
the React Native libraries. Same goes for state management, just there to remember which
thread/dashboard the user was on at the time. New dashboards would get added into the segmented button.
The widgets are line charts interfaces nested inside the dashboard interface, 
with the data of the line charts being hardcoded. Whenever a widget gets added 
to the active dashboard, another line chart is added to the existing
array of line charts inside the dashboard.