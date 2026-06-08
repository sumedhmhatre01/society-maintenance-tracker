export function renderSidebar() {
  return `
  <aside class="
    fixed left-0 top-0 z-50
    h-screen w-72
    bg-white/5
    backdrop-blur-2xl
    border-r border-white/10
  ">

    <div class="p-8">

      <h1 class="
      text-2xl
      font-bold
      text-white">
      Society Tracker
      </h1>

      <p class="text-slate-400 text-sm mt-1">
      Premium Dashboard
      </p>

    </div>

    <nav class="px-4 space-y-2">

      <a href="dashboard.html" class="sidebar-link active-link">
        📊 Dashboard
      </a>

      <a href="members.html" class="sidebar-link">
        👥 Members
      </a>

      <a href="payments.html" class="sidebar-link">
        💳 Payments
      </a>

      <a href="reports.html" class="sidebar-link">
        📈 Reports
      </a>

      <a href="settings.html" class="sidebar-link">
        ⚙️ Settings
      </a>

    </nav>

  </aside>
  `;
}
