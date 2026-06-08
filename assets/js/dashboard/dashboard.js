import { supabase } from "../config/supabase.js";

let chartInstance = null;

const monthFilter =
document.getElementById(
"dashboardMonth"
);

const yearFilter =
document.getElementById(
"dashboardYear"
);

function animateValue(
element,
start,
end,
duration = 1000
){

let startTime = null;

function animate(time){

if(!startTime)
startTime = time;

const progress =
Math.min(
(time - startTime)
/ duration,
1
);

const value =
Math.floor(
progress *
(end - start)
+ start
);

element.textContent =
value;

if(progress < 1){

requestAnimationFrame(
animate
);

}

}

requestAnimationFrame(
animate
);

}

async function loadDashboard(){

try{

const selectedMonth =
parseInt(
monthFilter.value
);

const selectedYear =
parseInt(
yearFilter.value
);

document.getElementById(
"chartPeriod"
).textContent =
`${selectedMonth}/${selectedYear}`;

const {
data: members,
error: membersError
}
=
await supabase
.from("members")
.select("*");

if(membersError)
throw membersError;

const {
data: payments,
error: paymentsError
}
=
await supabase
.from("payments")
.select("*")
.eq(
"month",
selectedMonth
)
.eq(
"year",
selectedYear
)
.order(
"payment_date",
{
ascending:false
}
);

if(paymentsError)
throw paymentsError;

const totalMembers =
members.length;

const paidMembers =
payments.filter(
payment =>
payment.status ===
"Paid"
).length;

const partialMembers =
payments.filter(
payment =>
payment.status ===
"Partial"
).length;

const memberIds =
new Set(
payments.map(
payment =>
payment.member_id
)
);

const unpaidMembers =
Math.max(
totalMembers -
memberIds.size,
0
);

const collectionAmount =
payments.reduce(
(total,payment)=>
total +
Number(
payment.amount || 0
),
0
);

const expectedCollection =
members.reduce(
(total,member)=>
total +
Number(
member.maintenance_amount || 0
),
0
);

const collectionPercentage =
expectedCollection > 0
?
Math.round(
(
collectionAmount /
expectedCollection
)
* 100
)
:
0;

animateValue(
document.getElementById(
"totalMembers"
),
0,
totalMembers
);

animateValue(
document.getElementById(
"paidMembers"
),
0,
paidMembers
);

animateValue(
document.getElementById(
"partialMembers"
),
0,
partialMembers
);

animateValue(
document.getElementById(
"unpaidMembers"
),
0,
unpaidMembers
);

document.getElementById(
"collectionAmount"
).textContent =
"₹" +
collectionAmount
.toLocaleString();

document.getElementById(
"collectionPercentage"
).textContent =
collectionPercentage +
"%";

buildChart(
payments
);

buildActivities(
payments,
members
);

}catch(error){

console.error(
"Dashboard Error:",
error
);

}

}

function buildActivities(
payments,
members
){

const activityBox =
document.getElementById(
"recentActivities"
);

activityBox.innerHTML =
"";

if(
!payments ||
payments.length === 0
){

activityBox.innerHTML =
`
<p class="text-slate-400">
No activities found
</p>
`;

return;

}

payments
.slice(0,5)
.forEach(payment=>{

const member =
members.find(
m =>
m.id ===
payment.member_id
);

activityBox.innerHTML +=
`
<div
class="
p-4
rounded-xl
bg-white/5">

<p
class="font-medium">

${member?.name || "Unknown"}

</p>

<p
class="
text-sm
text-slate-400">

${payment.status}
•
₹${payment.amount}

</p>

</div>
`;

});

}

function buildChart(
payments
){

const monthlyTotals =
Array(12).fill(0);

payments.forEach(
payment=>{

const monthIndex =
payment.month - 1;

monthlyTotals[
monthIndex
] += Number(
payment.amount || 0
);

}
);

const canvas =
document.getElementById(
"collectionChart"
);

if(!canvas) return;

const ctx =
canvas.getContext(
"2d"
);

if(chartInstance){

chartInstance.destroy();

}

chartInstance =
new Chart(ctx,{

type:"bar",

data:{

labels:[

"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"

],

datasets:[{

label:"Collection",

data:
monthlyTotals,

borderRadius:
12

}]

},

options:{

responsive:true,

maintainAspectRatio:
false,

plugins:{

legend:{

labels:{

color:"white"

}

}

},

scales:{

x:{

ticks:{

color:"white"

},

grid:{

color:
"rgba(255,255,255,0.08)"

}

},

y:{

ticks:{

color:"white"

},

grid:{

color:
"rgba(255,255,255,0.08)"

}

}

}

}

});

}

monthFilter.addEventListener(
"change",
loadDashboard
);

yearFilter.addEventListener(
"change",
loadDashboard
);

loadDashboard();