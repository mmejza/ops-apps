const correctOrder = [2,4,1,5,6,7,3];
let userSteps = [];

function selectStep(step){

userSteps.push(step);

if(userSteps.length === correctOrder.length){

if(JSON.stringify(userSteps) === JSON.stringify(correctOrder)){

document.getElementById("stepFeedback").innerHTML =
"✅ Correct! You followed the proper sequence.";

}else{

document.getElementById("stepFeedback").innerHTML =
"❌ Incorrect order. Try again.";
}

userSteps=[];
}

}

function checkMatch(){

let term = document.getElementById("term").value;
let def = document.getElementById("definition").value;

let correct = false;

if(term=="xbar" && def=="1") correct=true;
if(term=="xbarbar" && def=="2") correct=true;
if(term=="ucl" && def=="3") correct=true;
if(term=="lcl" && def=="4") correct=true;

if(correct){

document.getElementById("matchFeedback").innerHTML="✅ Correct";

}else{

document.getElementById("matchFeedback").innerHTML="❌ Incorrect";

}

}

function answer(choice){

if(choice=="in"){

document.getElementById("analysisFeedback").innerHTML =
"✅ Correct. All sample means lie within control limits.";

}else{

document.getElementById("analysisFeedback").innerHTML =
"❌ Incorrect. No sample mean exceeds the limits.";

}

}