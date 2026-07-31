export function OrganizerTable({ title, description, action, children }) {
  return (
    <div className="rounded-[20px] border border-[#ececec] bg-white p-6 shadow-[0_2px_8px_rgba(15,15,16,0.06)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f0f10]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[#6b6b70]">{description}</p>}
        </div>
        {action ? <div>{action}</div> : null}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm text-[#0f0f10]">{children}</table>
      </div>
    </div>
  );
}
