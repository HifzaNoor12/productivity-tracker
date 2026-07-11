let token = localStorage.getItem("token");

if(
!token &&
!window.location.pathname.includes("login.html") &&
!window.location.pathname.includes("register.html")
)
{

alert("Please Login First");

window.location.href="login.html";

}



let registerForm=document.getElementById("registerForm");


if(registerForm)
{


registerForm.addEventListener("submit",async function(e){


e.preventDefault();



let name=document.getElementById("name").value.trim();

let email=document.getElementById("email").value.trim();

let password=document.getElementById("password").value;



if(name.length < 3)
{

alert("Name must contain at least 3 characters");

return;

}



let emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;



if(!emailPattern.test(email))
{

alert("Enter valid email");

return;

}



if(password.length < 6)
{

alert("Password must contain at least 6 characters");

return;

}




let user={

name:name,

email:email,

password:password

};



try{

let response = await fetch("/api/register",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(user)

});


let data = await response.json();


if(response.ok)
{

alert(data.message);

window.location.href="login.html";

}

else
{

alert(data.message);

}


}

catch(error)
{

console.log(error);

alert("Server Error");

}
}
)};


// ===============================
// LOGIN FUNCTION
// ===============================


let loginForm = document.getElementById("loginForm");


if(loginForm)
{


loginForm.addEventListener("submit", async function(e){


e.preventDefault();



let email =
document.getElementById("loginEmail").value.trim();



let password =
document.getElementById("loginPassword").value;




// Validation


if(email === "")
{

alert("Email is required");

return;

}



if(password === "")
{

alert("Password is required");

return;

}




let user = {

email:email,

password:password

};




try{


let response = await fetch("/api/login",
{

method:"POST",


headers:{

"Content-Type":"application/json"

},


body:JSON.stringify(user)

}

);



let data = await response.json();




if(response.ok)
{


alert(data.message);



// Save JWT token

localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"user",
JSON.stringify(data.user)
);


// Move to dashboard

window.location.href="dashboard.html";


}


else
{


alert(data.message);


}



}


catch(error)
{

console.log(error);

alert("Server Error");


}



});


}

// ADD TASK FUNCTION


// ===============================
// CREATE TASK FUNCTION
// ===============================


let taskForm = document.getElementById("taskForm");


if(taskForm)
{


taskForm.addEventListener("submit", async function(e){


e.preventDefault();



let title =
document.getElementById("taskTitle").value.trim();



let description =
document.getElementById("taskDescription").value.trim();



let deadline =
document.getElementById("taskDeadline").value;



if(title === "")
{

alert("Task title required");

return;

}


if(deadline === "")
{

alert("Task deadline required");

return;

}


// get logged in user

let user =
JSON.parse(localStorage.getItem("user"));



let task = {


title:title,

description:description,

deadline:deadline,

userId:user._id


};



try{


let response = await 
fetch("/api/tasks",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(task)

}

);



let data = await response.json();



if(response.ok)
{

alert(data.message);

window.location.href="tasks.html";

}

else
{

alert(data.message);

}


}


catch(error)
{

console.log(error);

alert("Server Error");

}


});


}


// DISPLAY TASKS


// ===============================
// DISPLAY TASKS
// ===============================


let taskList =
document.getElementById("taskList");


if(taskList)
{


let user =
JSON.parse(localStorage.getItem("user"));



fetch(
`/api/tasks/${user._id}`
)

.then(response=>response.json())


.then(tasks=>{


if(tasks.length === 0)
{

taskList.innerHTML=
"<p>No Tasks Available</p>";

}


tasks.forEach(task=>{


taskList.innerHTML +=`


<div class="task-card">


<h3>
${task.title}
</h3>


<p>
${task.description}
</p>


<p>
Deadline:
${task.deadline}
</p>



<p>
Status:
${task.status}
</p>



<button onclick="completeTask('${task._id}')">

Complete

</button>



<button onclick="deleteTask('${task._id}')">

Delete

</button>



</div>


`;


});
});


}


// COMPLETE TASK FUNCTION


async function completeTask(id)
{


let response =
await fetch(
`/api/tasks/${id}`,
{

method:"PUT",

headers:{
"Content-Type":"application/json"
},


body:JSON.stringify({

status:"Completed"

})

}

);



let data =
await response.json();



alert(data.message);


location.reload();


} 
// DELETE TASK


// DELETE TASK FUNCTION


async function deleteTask(id)
{


let response =
await fetch(
`/api/tasks/${id}`,
{

method:"DELETE"

}

);


let data =
await response.json();



alert(data.message);


location.reload();


}
// ADD GOAL FUNCTION


// ===============================
// ADD GOAL FROM WEBSITE
// ===============================


let goalForm = document.getElementById("goalForm");


if(goalForm)
{


goalForm.addEventListener("submit",async function(e){


e.preventDefault();



let title =
document.getElementById("goalTitle").value.trim();



let description =
document.getElementById("goalDescription").value.trim();



let deadline =
document.getElementById("goalDeadline").value;



if(title=="")
{

alert("Goal title required");

return;

}



if(deadline=="")
{

alert("Deadline required");

return;

}



let user =
JSON.parse(localStorage.getItem("user"));



let goal = {


title:title,

description:description,

deadline:deadline,

userId:user._id


};



let response =
await fetch("/api/goals",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(goal)

}

);



let data =
await response.json();



alert(data.message);



window.location.href="goals.html";


});


}
// ===============================
// DISPLAY GOALS
// ===============================


let goalList =
document.getElementById("goalList");



if(goalList)
{


let user =
JSON.parse(localStorage.getItem("user"));



fetch(
`/api/goals/${user._id}`
)


.then(res=>res.json())


.then(goals=>{


if(goals.length==0)
{

goalList.innerHTML=
"<p>No Goals Added</p>";

return;

}



goals.forEach((goal,index)=>{


goalList.innerHTML +=`


<div class="goal-card">


<h3>
${goal.title}
</h3>


<p>
${goal.description}
</p>


<p>
Deadline:
${goal.deadline}
</p>


<div class="progress-container">

<div class="progress-bar"
style="width:${goal.progress}%">

${goal.progress}%

</div>

</div>



<a href="goal-details.html?id=${goal._id}">

<button>
View Details
</button>

</a>


<button onclick="deleteGoal('${goal._id}')">

Delete

</button>


</div>


`;


});


});


}
// ===============================
// GOAL DETAILS
// ===============================


let goalDetails =
document.getElementById("goalDetails");



if(goalDetails)
{


let params =
new URLSearchParams(window.location.search);



let id =
params.get("id");



fetch(
`/api/goal/${id}`
)


.then(res=>res.json())


.then(goal=>{


goalDetails.innerHTML=`


<div class="goal-card">


<h2>
${goal.title}
</h2>


<p>
${goal.description}
</p>


<p>
Deadline:
${goal.deadline}
</p>


<h3>
Progress:
${goal.progress}%
</h3>



<input 
type="number"
id="progressValue"
placeholder="Enter progress">



<button onclick="updateGoal('${goal._id}')">

Update Progress

</button>


</div>


`;


});


}

async function updateGoal(id)
{


let progress =
document.getElementById("progressValue").value;



if(progress<0 || progress>100)
{

alert("Progress must be between 0 and 100");

return;

}



let response =
await fetch(




`/api/goals/${id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

progress:Number(progress)

})

}

);



let data =
await response.json();



alert(data.message);



location.reload();


}
// DELETE GOAL FUNCTION
async function deleteGoal(id)
{


let response =
await fetch(

`/api/goals/${id}`,

{

method:"DELETE"

}

);



let data =
await response.json();



alert(data.message);



location.reload();


}
// DASHBOARD STATISTICS


// ===============================
// DASHBOARD TASK COUNT
// ===============================


let totalTaskCard = document.getElementById("totalTasks");

let completedTaskCard = document.getElementById("completedTasks");



if(totalTaskCard && completedTaskCard)
{


let user = JSON.parse(localStorage.getItem("user"));



fetch(
`/api/tasks/${user._id}`
)


.then(response => response.json())


.then(tasks => {



let totalTasks = tasks.length;



let completedTasks =
tasks.filter(
task => task.status === "Completed"
).length;



totalTaskCard.innerHTML = totalTasks;



completedTaskCard.innerHTML = completedTasks;



})



.catch(error=>{

console.log(error);

});


}
// ===============================
// DASHBOARD ACTIVE GOALS COUNT
// ===============================

let activeGoalCard =
document.getElementById("activeGoals");

if(activeGoalCard)
{

let user =
JSON.parse(localStorage.getItem("user"));

fetch(
`/api/goals/${user._id}`
)

.then(response=>response.json())

.then(goals=>{

// Count only goals whose progress is less than 100%

let activeGoals =
goals.filter(goal => goal.progress < 100).length;

// Display count

activeGoalCard.innerHTML = activeGoals;

})

.catch(error=>{

console.log(error);

});

}
// LOGOUT FUNCTION


function logout()
{

localStorage.removeItem("token");

localStorage.removeItem("user");

alert("Logged Out Successfully");

window.location.href="login.html";

}