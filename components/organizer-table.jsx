export function OrganizerTable({ title, description, action, children }) {
  return (
    <div className="card-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0f0f10]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[#6b6b70]">{description}</p>}
        </div>
        {action ? <div>{action}</div> : null}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="clean-table min-w-[720px]">{children}</table>
      </div>
    </div>
  );
}
