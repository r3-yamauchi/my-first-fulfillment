const App = require("actions-on-google").DialogflowApp;
const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.postToFirestore = functions.https.onRequest((request, response) => {

  const app = new App({ request, response });

  const myIntent = app => {
    const param = app.getArgument("param");
    if (!param) {
      app.ask(`「キントーン」と発声した後に、続けて書き込みたい言葉を話してください。`);
      return;
    }
    db.collection("users").doc("user1").collection("documents").doc().set({
      "content": param
    }).then(() => {
      app.tell(`${param} と書き込みました。`);
    }).catch(error => {
      app.tell(`ごめんなさい。書き込みでエラーが発生しました。`);
    });
  };

  const actionMap = new Map();
  actionMap.set("input.welcome", myIntent);
  actionMap.set("actionPostToFirestore", myIntent);
  app.handleRequest(actionMap);
});
