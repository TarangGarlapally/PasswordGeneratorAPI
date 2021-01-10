const express = require("express");
const bp = require("body-parser");
const firebase = require("firebase/app");
require("firebase/firestore");

const algoK81 = require("./Algorithms/algoK81.js");
const algoK82 = require("./Algorithms/algoK82.js");
const algoK91 = require("./Algorithms/algoK91.js");
const algoK92 = require("./Algorithms/algoK92.js");
const algoM01 = require("./Algorithms/algoM01.js");
const algoM02 = require("./Algorithms/algoM02.js");
const algoP21 = require("./Algorithms/algoP21.js");
const algoP22 = require("./Algorithms/algoP22.js");
const algoQ51 = require("./Algorithms/algoQ51.js");
const algoQ52 = require("./Algorithms/algoQ52.js");
const algoQ91 = require("./Algorithms/algoQ91.js");
const algoQ92 = require("./Algorithms/algoQ92.js");

const app = express();


app.use(bp.urlencoded({
	extended: true
}));


var firebaseConfig = {
    apiKey: "AIzaSyB-b5cHjMyavsfTfs4ikLWXD__EqZFTgVo",
    authDomain: "strong-password-generato-bcf8f.firebaseapp.com",
    projectId: "strong-password-generato-bcf8f",
    storageBucket: "strong-password-generato-bcf8f.appspot.com",
    messagingSenderId: "431782285893",
    appId: "1:431782285893:web:127afb3853c10a97ce892c",
    measurementId: "G-ER6GPJQBRS"
 };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


app.get("/", (req, res) => {
	    res.sendFile('index.html', {root: __dirname })
})

app.post("/get-pwd", async (req, res)=>{

	res.setHeader('Access-Control-Allow-Origin', '*');
	
	if(req.body.name==null || req.body.date==null){
		res.send({error:"Name and Date are compulsory."})
	}
	else if(req.body.name.length<4){
		res.send({error:"Name should be atleast 4 characters long."});
	}
	else{
	var cnt = 0;
	//get user_count from firebase
	cnt = await firebase.firestore().collection("usage").doc("usage_doc").get()
		.then(snapshot => {
		return snapshot.data().user_count+1;
		
		}).catch(err=>{
			console.log("Failed to get user count!\n"+err)
		});
	console.log(cnt);

	//create password
	const algo_array = [algoK81, algoK82, algoK91, algoK92, algoM01, algoM02, algoP21, algoP22, algoQ51, algoQ52, algoQ91, algoQ92];
	const algo = algo_array[Math.floor(Math.random() * algo_array.length)]; 

	var pwd = algo(req.body.name,req.body.date, cnt);

	//update firebase
	firebase.firestore().collection("usage").doc("usage_doc").update({
				user_count: cnt
			}).catch(err=>{
			console.log("Failed to update user count!\n"+err)
			});
	res.send({password: pwd});
	}
});


app.listen(process.env.PORT || 3000, ()=>{
	console.log("Server Started.");
});