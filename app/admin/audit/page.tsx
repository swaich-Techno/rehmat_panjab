export default function AdminAuditPage() {
  return (
    <div>
      <p className="label text-forest">Audit</p>
      <h1 className="display mt-3 text-5xl">Log stub</h1>
      <p className="mt-6 max-w-lg text-base leading-8 text-ink/75">
        When a database exists, staff writes land in <code>admin_audit_log</code>. Until then this page stays empty rather than inventing history.
      </p>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="label">
            <th className="py-3">When</th>
            <th>Actor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-ink/10">
            <td className="py-4 text-ink/50" colSpan={3}>
              No entries. Preview sessions are not a production audit trail.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
