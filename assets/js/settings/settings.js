import { supabase } from "../config/supabase.js";

const form =
document.getElementById(
"settingsForm"
);

async function loadSettings(){

const {
data
}
=
await supabase
.from("settings")
.select("*")
.limit(1)
.single();

if(!data) return;

document.getElementById(
"societyName"
).value =
data.society_name || "";

document.getElementById(
"societyAddress"
).value =
data.society_address || "";

document.getElementById(
"maintenanceAmount"
).value =
data.maintenance_amount || "";

document.getElementById(
"adminName"
).value =
data.admin_name || "";

document.getElementById(
"adminPhone"
).value =
data.admin_phone || "";

}

form.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const payload = {

society_name:
document.getElementById(
"societyName"
).value,

society_address:
document.getElementById(
"societyAddress"
).value,

maintenance_amount:
document.getElementById(
"maintenanceAmount"
).value,

admin_name:
document.getElementById(
"adminName"
).value,

admin_phone:
document.getElementById(
"adminPhone"
).value

};

const {
data: existing
}
=
await supabase
.from("settings")
.select("id")
.limit(1);

if(
existing &&
existing.length
){

await supabase
.from("settings")
.update(payload)
.eq(
"id",
existing[0].id
);

}else{

await supabase
.from("settings")
.insert(payload);

}

alert(
"Settings Saved"
);

});

loadSettings();