export function OrganizerTable({ title, description, action, children }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        {action ? <div>{action}</div> : null}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm text-slate-700">{children}</table>
      </div>
    </div>
  );
}
