"use client";
export function DeleteAlert({ id }: { id: string }) {
  return (
    <button className="text-xs text-down hover:underline" onClick={async () => { await fetch(`/api/alerts?id=${id}`, { method: "DELETE" }); location.reload(); }}>
      Remove
    </button>
  );
}
