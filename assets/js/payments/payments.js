import { supabase } from "../config/supabase.js";

const paymentsTable =
document.getElementById(
"paymentsTable"
);

const monthFilter =
document.getElementById(
"monthFilter"
);

const yearFilter =
document.getElementById(
"yearFilter"
);

const searchMember =
document.getElementById(
"searchMember"
);

const historyModal =
document.getElementById(
"historyModal"
);

const historyContent =
document.getElementById(
"historyContent"
);

function getStatusBadge(status){

if(status === "Paid"){

return `
<span
class="
px-3 py-1
rounded-full
bg-green-500/20
text-green-400">

Paid

</span>
`;

}

if(status === "Partial"){

return `
<span
class="
px-3 py-1
rounded-full
bg-yellow-500/20
text-yellow-300">

Partial

</span>
`;

}

return `
<span
class="
px-3 py-1
rounded-full
bg-red-500/20
text-red-400">

Unpaid

</span>
`;

}

async function updateStatus(
memberId,
status,
amount
){

const month =
parseInt(
monthFilter.value
);

const year =
parseInt(
yearFilter.value
);

const {
data: existing
}
=
await supabase
.from("payments")
.select("*")
.eq(
"member_id",
memberId
)
.eq(
"month",
month
)
.eq(
"year",
year
)
.maybeSingle();

if(existing){

await supabase
.from("payments")
.update({

status,
amount,

payment_date:
new Date()
.toISOString()
.split("T")[0]

})
.eq(
"id",
existing.id
);

}else{

await supabase
.from("payments")
.insert({

member_id:
memberId,

month,
year,

amount,
status,

payment_date:
new Date()
.toISOString()
.split("T")[0]

});

}

loadPayments();

}

async function showHistory(
memberId
){

historyModal.classList.remove(
"hidden"
);

historyModal.classList.add(
"flex"
);

historyContent.innerHTML =
`
<p class="text-slate-400">
Loading...
</p>
`;

const {
data
}
=
await supabase
.from("payments")
.select("*")
.eq(
"member_id",
memberId
)
.order(
"year",
{
ascending:false
}
);

if(
!data ||
!data.length
){

historyContent.innerHTML =
`
<p class="text-slate-400">
No payment history found
</p>
`;

return;

}

historyContent.innerHTML =
`
<table class="w-full">

<thead>

<tr
class="
border-b
border-white/10">

<th class="py-3 text-left">
Month
</th>

<th class="py-3 text-left">
Year
</th>

<th class="py-3 text-left">
Amount
</th>

<th class="py-3 text-left">
Status
</th>

</tr>

</thead>

<tbody>

${data.map(payment=>`

<tr
class="
border-b
border-white/5">

<td class="py-3">
${payment.month}
</td>

<td>
${payment.year}
</td>

<td>
₹${payment.amount}
</td>

<td>
${payment.status}
</td>

</tr>

`).join("")}

</tbody>

</table>
`;

}

async function loadPayments(){

paymentsTable.innerHTML =
`
<tr>
<td colspan="5"
class="py-8 text-center">
Loading...
</td>
</tr>
`;

const month =
parseInt(
monthFilter.value
);

const year =
parseInt(
yearFilter.value
);

const {
data: members
}
=
await supabase
.from("members")
.select("*")
.order("id");

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

paymentsTable.innerHTML =
"";

members.forEach(member=>{

const payment =
payments.find(
p =>
p.member_id ===
member.id
);

const status =
payment?.status ||
"Unpaid";

paymentsTable.innerHTML +=
`

<tr
class="
border-b
border-white/5">

<td class="py-4">
${member.name}
</td>

<td>
${member.flat_no}
</td>

<td>
₹${member.maintenance_amount}
</td>

<td>
${getStatusBadge(
status
)}
</td>

<td
class="
flex
gap-2
py-3">

<button
class="
paid-btn
px-3 py-2
rounded-lg
bg-green-600"
data-id="${member.id}"
data-amount="${member.maintenance_amount}">

Paid

</button>

<button
class="
partial-btn
px-3 py-2
rounded-lg
bg-yellow-600"
data-id="${member.id}"
data-amount="${member.maintenance_amount}">

Partial

</button>

<button
class="
history-btn
px-3 py-2
rounded-lg
bg-cyan-600"
data-id="${member.id}">

History

</button>

</td>

</tr>

`;

});

document
.querySelectorAll(
".paid-btn"
)
.forEach(btn=>{

btn.onclick = ()=>{

updateStatus(
btn.dataset.id,
"Paid",
btn.dataset.amount
);

};

});

document
.querySelectorAll(
".partial-btn"
)
.forEach(btn=>{

btn.onclick = ()=>{

updateStatus(
btn.dataset.id,
"Partial",
btn.dataset.amount
);

};

});

document
.querySelectorAll(
".history-btn"
)
.forEach(btn=>{

btn.onclick = ()=>{

showHistory(
btn.dataset.id
);

};

});

}

document
.getElementById(
"closeHistoryModal"
)
.addEventListener(
"click",
()=>{

historyModal.classList.remove(
"flex"
);

historyModal.classList.add(
"hidden"
);

}
);

monthFilter.addEventListener(
"change",
loadPayments
);

yearFilter.addEventListener(
"change",
loadPayments
);

searchMember.addEventListener(
"input",
()=>{

const value =
searchMember.value
.toLowerCase();

document
.querySelectorAll(
"#paymentsTable tr"
)
.forEach(row=>{

row.style.display =
row.textContent
.toLowerCase()
.includes(value)
? ""
: "none";

});

}
);

document
.getElementById(
"refreshBtn"
)
.addEventListener(
"click",
loadPayments
);

loadPayments();