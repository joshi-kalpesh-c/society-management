import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MembershipView } from "@society/contracts";

interface MeResponse {
  userId: string;
  memberships: MembershipView[];
}

export function DashboardPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<MeResponse>("/api/v1/me")
      .then(setMe)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Skeleton — admin/resident surfaces arrive in Phase 2+.
      </p>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {me && (
        <div className="mt-6 space-y-2">
          <p className="text-sm">
            Signed in as <code>{me.userId}</code>
          </p>
          {me.memberships.map((m) => (
            <div key={`${m.societyId}-${m.role}`} className="rounded-md border p-3 text-sm">
              {m.societyName} — {m.role}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
