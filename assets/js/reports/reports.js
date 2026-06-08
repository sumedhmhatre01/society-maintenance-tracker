import { supabase } from "../config/supabase.js";

let chartInstance = null;

const monthFilter =
document.getElementById(
"reportMonth"
);

const yearFilter =
document.getElementById(
"reportYear"
);

async function loadReports(){

try{

const month =
parseInt(
monthFilter.value
);

const year =
parseInt(
yearFilter.value
);

document.getElementById(
"reportPeriod"
).textContent =
`${month}/${year}`;

const {
data: members
}
=
await supabase
.from("members")
.select("*");

const {
data: payments
}
=
await supabase
.from("payments")
.select("*")
.eq(
"month",
month
)
.eq(
"year",
year
);

const totalMembers =
members.length;

const paidMembers =
payments.filter(
p =>
p.status === "Paid"
).length;

const partialMembers =
payments.filter(
p =>
p.status === "Partial"
).length;

const memberIds =
new Set(
payments.map(
p =>
p.member_id
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
(sum,p)=>
sum +
Number(
p.amount || 0
),
0
);

document.getElementById(
"reportTotalMembers"
).textContent =
totalMembers;

document.getElementById(
"reportPaidMembers"
).textContent =
paidMembers;

document.getElementById(
"reportPartialMembers"
).textContent =
partialMembers;

document.getElementById(
"reportUnpaidMembers"
).textContent =
unpaidMembers;

document.getElementById(
"reportCollection"
).textContent =
"₹" +
collectionAmount
.toLocaleString();

buildTable(
payments,
members
);

buildChart(
payments
);

}catch(error){

console.error(
error
);

}

}

function buildTable(
payments,
members
){

const table =
document.getElementById(
"reportsTable"
);

table.innerHTML = "";

if(
!payments ||
payments.length === 0
){

table.innerHTML = `
<tr>
<td
colspan="5"
class="
py-8
text-center
text-slate-400">

No records found

</td>
</tr>
`;

return;

}

payments.forEach(
payment=>{

const member =
members.find(
m =>
m.id ===
payment.member_id
);

table.innerHTML += `

<tr
class="
border-b
border-white/5">

<td
class="py-4">

${member?.name || "-"}

</td>

<td>

${member?.flat_no || "-"}

</td>

<td>

₹${payment.amount}

</td>

<td>

<span
class="
px-3 py-1
rounded-full
${
payment.status === "Paid"
?
"bg-green-500/20 text-green-400"
:
"bg-yellow-500/20 text-yellow-400"
}">

${payment.status}

</span>

</td>

<td>

${payment.payment_date || "-"}

</td>

</tr>

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

const index =
payment.month - 1;

monthlyTotals[index] +=
Number(
payment.amount || 0
);

}
);

const canvas =
document.getElementById(
"reportsChart"
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

label:
"Collection",

data:
monthlyTotals,

borderRadius:
12

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

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

function exportCSV(){

const rows = [

[
"Member",
"Amount",
"Status",
"Date"
]

];

document
.querySelectorAll(
"#reportsTable tr"
)
.forEach(row=>{

const cols =
row.querySelectorAll(
"td"
);

if(cols.length){

rows.push([

cols[0].innerText,
cols[2].innerText,
cols[3].innerText,
cols[4].innerText

]);

}

});

let csvContent =
"data:text/csv;charset=utf-8,";

rows.forEach(
row=>{

csvContent +=
row.join(",")
+ "\n";

}
);

const encodedUri =
encodeURI(
csvContent
);

const link =
document.createElement(
"a"
);

link.href =
encodedUri;

link.download =
"report.csv";

document.body
.appendChild(
link
);

link.click();

link.remove();

}

function exportExcel(){

const data = [];

document
.querySelectorAll(
"#reportsTable tr"
)
.forEach(row=>{

const cols =
row.querySelectorAll(
"td"
);

if(cols.length){

data.push({

Member:
cols[0].innerText,

Amount:
cols[2].innerText,

Status:
cols[3].innerText,

Date:
cols[4].innerText

});

}

});

if(!data.length){

alert(
"No data available"
);

return;

}

const worksheet =
XLSX.utils
.json_to_sheet(
data
);

const workbook =
XLSX.utils
.book_new();

XLSX.utils
.book_append_sheet(
workbook,
worksheet,
"Report"
);

const month =
monthFilter.value;

const year =
yearFilter.value;

XLSX.writeFile(
workbook,
`Society_Report_${month}_${year}.xlsx`
);

}

document
.getElementById(
"exportCSV"
)
.addEventListener(
"click",
exportCSV
);

document
.getElementById(
"exportExcel"
)
.addEventListener(
"click",
exportExcel
);

monthFilter
.addEventListener(
"change",
loadReports
);

yearFilter
.addEventListener(
"change",
loadReports
);

loadReports();