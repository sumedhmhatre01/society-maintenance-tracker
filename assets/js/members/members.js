import { supabase } from "../config/supabase.js";

const modal =
  document.getElementById("memberModal");

const memberForm =
  document.getElementById("memberForm");

const searchInput =
  document.getElementById("searchInput");

const addMemberBtn =
  document.getElementById("addMemberBtn");

const closeModalBtn =
  document.getElementById("closeModal");

const modalTitle =
  document.getElementById("modalTitle");

const memberIdInput =
  document.getElementById("memberId");

addMemberBtn.onclick = () => {

  modalTitle.textContent =
    "Add Member";

  memberForm.reset();

  memberIdInput.value = "";

  modal.classList.remove("hidden");
  modal.classList.add("flex");

};

closeModalBtn.onclick = () => {

  closeModal();

};

window.onclick = (e) => {

  if (e.target === modal) {

    closeModal();

  }

};

function closeModal() {

  modal.classList.remove("flex");
  modal.classList.add("hidden");

}

async function deleteMember(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this member?"
    );

  if (!confirmed) return;

  const { error } =
    await supabase
      .from("members")
      .delete()
      .eq("id", id);

  if (error) {

    console.error(error);
    alert(error.message);
    return;

  }

  await loadMembers(
    searchInput.value
  );

}

async function editMember(id) {

  const { data, error } =
    await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {

    console.error(error);
    return;

  }

  modalTitle.textContent =
    "Edit Member";

  memberIdInput.value =
    data.id;

  document.getElementById(
    "memberName"
  ).value =
    data.name;

  document.getElementById(
    "flatNo"
  ).value =
    data.flat_no;

  document.getElementById(
    "wing"
  ).value =
    data.wing;

  document.getElementById(
    "phone"
  ).value =
    data.phone || "";

  document.getElementById(
    "maintenance"
  ).value =
    data.maintenance_amount;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

}

async function loadMembers(
  search = ""
) {

  const table =
    document.getElementById(
      "membersTable"
    );

  table.innerHTML = `
    <tr>
      <td colspan="6"
      class="py-8 text-center text-slate-400">
      Loading...
      </td>
    </tr>
  `;

  let query =
    supabase
      .from("members")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );

  if (search) {

    query =
      query.ilike(
        "name",
        `%${search}%`
      );

  }

  const {
    data,
    error
  } = await query;

  if (error) {

    console.error(error);

    table.innerHTML = `
      <tr>
        <td colspan="6"
        class="py-8 text-center text-red-400">
        Failed to load members
        </td>
      </tr>
    `;

    return;

  }

  if (!data.length) {

    table.innerHTML = `
      <tr>
        <td colspan="6"
        class="py-8 text-center text-slate-400">
        No members found
        </td>
      </tr>
    `;

    return;

  }

  table.innerHTML = "";

  data.forEach(member => {

    table.innerHTML += `

    <tr
    class="
    member-row
    border-b
    border-white/5
    hover:bg-white/5
    transition">

      <td class="py-4">
        ${member.name}
      </td>

      <td>
        ${member.flat_no}
      </td>

      <td>
        ${member.wing}
      </td>

      <td>
        ${member.phone || "-"}
      </td>

      <td>
        ₹${member.maintenance_amount}
      </td>

      <td class="space-x-4">

        <button
        class="
        edit-btn
        text-cyan-400
        hover:text-cyan-300"
        data-id="${member.id}">

        Edit

        </button>

        <button
        class="
        delete-btn
        text-red-400
        hover:text-red-300"
        data-id="${member.id}">

        Delete

        </button>

      </td>

    </tr>

    `;

  });

  document
    .querySelectorAll(".delete-btn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          deleteMember(
            btn.dataset.id
          );

        }
      );

    });

  document
    .querySelectorAll(".edit-btn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          editMember(
            btn.dataset.id
          );

        }
      );

    });

}

memberForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const memberId =
      memberIdInput.value;

    const payload = {

      name:
        document.getElementById(
          "memberName"
        ).value,

      flat_no:
        document.getElementById(
          "flatNo"
        ).value,

      wing:
        document.getElementById(
          "wing"
        ).value,

      phone:
        document.getElementById(
          "phone"
        ).value,

      maintenance_amount:
        document.getElementById(
          "maintenance"
        ).value

    };

    let error = null;

    if (memberId) {

      const result =
        await supabase
          .from("members")
          .update(payload)
          .eq(
            "id",
            memberId
          );

      error =
        result.error;

    } else {

      const result =
        await supabase
          .from("members")
          .insert(payload);

      error =
        result.error;

    }

    if (error) {

      console.error(error);
      alert(error.message);
      return;

    }

    closeModal();

    memberForm.reset();

    await loadMembers(
      searchInput.value
    );

  }
);

searchInput.addEventListener(
  "input",
  () => {

    loadMembers(
      searchInput.value
    );

  }
);

loadMembers();