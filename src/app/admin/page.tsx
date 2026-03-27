"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api-client";
import type { UserProfile, TreeMetadata, JoinRequest, Connection } from "@/types";

type Tab = "overview" | "users" | "trees" | "requests" | "connections";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Data
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [trees, setTrees] = useState<TreeMetadata[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/verify");
      return;
    }
    if (user) checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const checkAdmin = async () => {
    if (!user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
    setIsAdmin(true);
    setLoading(false);
  };

  // Load data when tab changes or on first render
  useEffect(() => {
    if (!isAdmin) return;
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const loadAllData = async () => {
    try {
      const [statsRes, usersRes, treesRes, requestsRes, connectionsRes] = await Promise.all([
        api.get<{ stats: { deletedCount: number } }>("/api/admin/stats"),
        api.get<{ users: UserProfile[] }>("/api/admin/users"),
        api.get<{ trees: TreeMetadata[] }>("/api/admin/trees"),
        api.get<{ requests: JoinRequest[] }>("/api/admin/requests"),
        api.get<{ connections: Connection[] }>("/api/admin/connections"),
      ]);
      setUsers(usersRes.users || []);
      setTrees(treesRes.trees || []);
      setJoinRequests(requestsRes.requests || []);
      setConnections(connectionsRes.connections || []);
      setDeletedCount(statsRes.stats?.deletedCount || 0);
      setDataLoaded(true);
    } catch (err) {
      console.error("Admin data load error:", err);
      setDataLoaded(true);
    }
  };

  const handleApproveJoin = async (requestId: string) => {
    if (!user) return;
    try {
      await api.post(`/api/join-requests/${requestId}/approve`);
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r))
      );
    } catch (err) { console.error("Approve error:", err); }
  };

  const handleRejectJoin = async (requestId: string) => {
    try {
      await api.post(`/api/join-requests/${requestId}/reject`);
      setJoinRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      );
    } catch (err) { console.error("Reject error:", err); }
  };

  const handleApproveConnection = async (connectionId: string) => {
    try {
      await api.post(`/api/connections/${connectionId}/approve`);
      setConnections((prev) =>
        prev.map((c) => (c.id === connectionId ? { ...c, status: "approved" } : c))
      );
    } catch (err) { console.error("Approve connection error:", err); }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="text-dark/60">
          <span className="loading-dot" />
          Loading...
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingJoins = joinRequests.filter((r) => r.status === "pending");
  const pendingConns = connections.filter((c) => c.status === "pending");
  const totalMembers = trees.reduce((sum, t) => sum + (t.totalMembers || 0), 0);

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "users", label: "Users", badge: users.length },
    { key: "trees", label: "Trees", badge: trees.length },
    { key: "requests", label: "Requests", badge: pendingJoins.length },
    { key: "connections", label: "Connections", badge: pendingConns.length },
  ];

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-block text-sm text-dark/40 hover:text-accent"
            >
              &larr; Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-dark">Admin Panel</h1>
            <p className="mt-1 text-sm text-dark/50">
              Platform management — privacy preserved
            </p>
          </div>
          <div className="rounded-btn bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            ADMIN
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mt-6 flex gap-1 overflow-x-auto rounded-card bg-bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-shrink-0 rounded-[12px] px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white text-dark shadow-sm"
                  : "text-dark/50 hover:text-dark"
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    tab.key === "requests" || tab.key === "connections"
                      ? "bg-warning/20 text-warning"
                      : "bg-dark/10 text-dark/50"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {!dataLoaded ? (
            <div className="py-12 text-center text-dark/40">
              <span className="loading-dot" /> Loading data...
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  userCount={users.length}
                  treeCount={trees.length}
                  totalMembers={totalMembers}
                  pendingJoins={pendingJoins.length}
                  pendingConns={pendingConns.length}
                  deletedCount={deletedCount}
                  recentUsers={users.slice(0, 5)}
                  recentTrees={trees.slice(0, 5)}
                />
              )}
              {activeTab === "users" && <UsersTab users={users} />}
              {activeTab === "trees" && <TreesTab trees={trees} />}
              {activeTab === "requests" && (
                <RequestsTab
                  requests={joinRequests}
                  onApprove={handleApproveJoin}
                  onReject={handleRejectJoin}
                />
              )}
              {activeTab === "connections" && (
                <ConnectionsTab
                  connections={connections}
                  onApprove={handleApproveConnection}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ───
function OverviewTab({
  userCount,
  treeCount,
  totalMembers,
  pendingJoins,
  pendingConns,
  deletedCount,
  recentUsers,
  recentTrees,
}: {
  userCount: number;
  treeCount: number;
  totalMembers: number;
  pendingJoins: number;
  pendingConns: number;
  deletedCount: number;
  recentUsers: UserProfile[];
  recentTrees: TreeMetadata[];
}) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Registered Users" value={userCount} icon="👤" />
        <StatCard label="Active Trees" value={treeCount} icon="🌳" />
        <StatCard label="Total Members" value={totalMembers} icon="👨‍👩‍👧‍👦" />
        <StatCard label="Pending Joins" value={pendingJoins} icon="📩" color="warning" />
        <StatCard label="Pending Connections" value={pendingConns} icon="🔗" color="info" />
        <StatCard label="Deleted Items" value={deletedCount} icon="🗑" color="error" />
      </div>

      {/* Recent Users */}
      <div>
        <h2 className="font-bold text-dark">Recent Signups</h2>
        <p className="text-xs text-dark/40">Latest registered users</p>
        <div className="mt-3 space-y-2">
          {recentUsers.length === 0 ? (
            <p className="py-4 text-center text-sm text-dark/40">No users yet</p>
          ) : (
            recentUsers.map((u) => (
              <UserRow key={u.id} user={u} />
            ))
          )}
        </div>
      </div>

      {/* Recent Trees */}
      <div>
        <h2 className="font-bold text-dark">Recent Trees</h2>
        <p className="text-xs text-dark/40">Latest created family trees</p>
        <div className="mt-3 space-y-2">
          {recentTrees.length === 0 ? (
            <p className="py-4 text-center text-sm text-dark/40">No trees yet</p>
          ) : (
            recentTrees.map((t) => (
              <TreeRow key={t.treeId} tree={t} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ───
function UsersTab({ users }: { users: UserProfile[] }) {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.phone?.includes(s) ||
      u.id.toLowerCase().includes(s) ||
      u.district?.toLowerCase().includes(s) ||
      u.gotra?.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-dark">All Users ({users.length})</h2>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, UID, district, gotra..."
        className="input-field mt-3"
      />
      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-dark/40">No users found</p>
        ) : (
          filtered.map((u) => <UserRow key={u.id} user={u} expanded />)
        )}
      </div>
    </div>
  );
}

// ─── Trees Tab ───
function TreesTab({ trees }: { trees: TreeMetadata[] }) {
  const [search, setSearch] = useState("");

  const filtered = trees.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      t.treeId.toLowerCase().includes(s) ||
      t.familySurname.toLowerCase().includes(s) ||
      t.gotra?.toLowerCase().includes(s) ||
      t.village?.toLowerCase().includes(s) ||
      t.district?.toLowerCase().includes(s)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-dark">All Trees ({trees.length})</h2>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by tree ID, surname, gotra, village, district..."
        className="input-field mt-3"
      />
      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-dark/40">No trees found</p>
        ) : (
          filtered.map((t) => <TreeRow key={t.treeId} tree={t} expanded />)
        )}
      </div>
    </div>
  );
}

// ─── Requests Tab ───
function RequestsTab({
  requests,
  onApprove,
  onReject,
}: {
  requests: JoinRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      {/* Pending */}
      <div>
        <h2 className="font-bold text-dark">
          Pending Requests ({pending.length})
        </h2>
        <div className="mt-3 space-y-2">
          {pending.length === 0 ? (
            <p className="py-4 text-center text-sm text-dark/40">
              No pending requests
            </p>
          ) : (
            pending.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark">{r.requesterName}</p>
                    <p className="text-xs text-dark/50">
                      Wants to join as: <span className="font-medium">{r.claimedRelation}</span>
                    </p>
                    <p className="text-xs text-dark/40">
                      Tree: <code className="font-mono text-accent">{r.treeId}</code>
                    </p>
                    <p className="text-xs text-dark/30">
                      {formatDate(r.requestedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(r.id)}
                      className="rounded-btn bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(r.id)}
                      className="rounded-btn bg-error/10 px-3 py-1.5 text-xs font-medium text-error hover:bg-error/20"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* History */}
      {resolved.length > 0 && (
        <div>
          <h2 className="font-bold text-dark">History ({resolved.length})</h2>
          <div className="mt-3 space-y-2">
            {resolved.map((r) => (
              <div key={r.id} className="card p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark">{r.requesterName}</p>
                    <p className="text-xs text-dark/40">
                      {r.claimedRelation} — Tree: {r.treeId}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Connections Tab ───
function ConnectionsTab({
  connections,
  onApprove,
}: {
  connections: Connection[];
  onApprove: (id: string) => void;
}) {
  const pending = connections.filter((c) => c.status === "pending");
  const resolved = connections.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-dark">
          Pending Connections ({pending.length})
        </h2>
        <div className="mt-3 space-y-2">
          {pending.length === 0 ? (
            <p className="py-4 text-center text-sm text-dark/40">
              No pending connections
            </p>
          ) : (
            pending.map((c) => (
              <div key={c.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-dark">
                      Marriage Connection
                    </p>
                    <p className="text-xs text-dark/50">
                      <code className="font-mono text-accent">{c.fromTreeId}</code>
                      {" → "}
                      <code className="font-mono text-accent">{c.toTreeId}</code>
                    </p>
                    <p className="text-xs text-dark/30">{formatDate(c.requestedAt)}</p>
                  </div>
                  <button
                    onClick={() => onApprove(c.id)}
                    className="rounded-btn bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {resolved.length > 0 && (
        <div>
          <h2 className="font-bold text-dark">History ({resolved.length})</h2>
          <div className="mt-3 space-y-2">
            {resolved.map((c) => (
              <div key={c.id} className="card p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-dark/50">
                      {c.fromTreeId} → {c.toTreeId}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared Components ───

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color?: "warning" | "info" | "error";
}) {
  const colorClass =
    color === "warning"
      ? "text-warning"
      : color === "info"
        ? "text-info"
        : color === "error"
          ? "text-error"
          : "text-accent";

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
      </div>
      <p className="mt-1 text-xs text-dark/50">{label}</p>
    </div>
  );
}

function UserRow({ user, expanded }: { user: UserProfile; expanded?: boolean }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-dark">
              {user.fullName || "No name"}
              {user.fullNameHi && (
                <span className="ml-1 text-dark/40">({user.fullNameHi})</span>
              )}
            </p>
            <RoleBadge role={user.role} />
          </div>
          <p className="mt-0.5 text-xs text-dark/50">
            {user.email || user.phone || "No contact"}
          </p>
          {expanded && (
            <>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark/40">
                {user.gotra && (
                  <span>
                    Gotra: <span className="text-dark/60">{user.gotra}</span>
                  </span>
                )}
                {user.district && (
                  <span>
                    District: <span className="text-dark/60">{user.district}</span>
                  </span>
                )}
                {user.village && (
                  <span>
                    Village: <span className="text-dark/60">{user.village}</span>
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark/30">
                <span>UID: {user.id.slice(0, 12)}...</span>
                {user.treeId && (
                  <span>
                    Tree:{" "}
                    <code className="font-mono text-accent">{user.treeId}</code>
                  </span>
                )}
                <span>Auth: {user.authMethod || "email"}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-dark/30">{formatDate(user.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function TreeRow({ tree, expanded }: { tree: TreeMetadata; expanded?: boolean }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-dark">
              🌳 {tree.familySurname} Family
            </p>
            <TreeStatusBadge status={tree.status} />
          </div>
          <p className="mt-0.5 text-xs text-dark/50">
            <code className="font-mono text-accent">{tree.treeId}</code>
          </p>
          {expanded && (
            <>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark/40">
                <span>
                  Gotra: <span className="text-dark/60">{tree.gotra}</span>
                </span>
                <span>
                  Village: <span className="text-dark/60">{tree.village}</span>
                </span>
                <span>
                  District: <span className="text-dark/60">{tree.district}</span>
                </span>
                <span>
                  State: <span className="text-dark/60">{tree.state}</span>
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark/30">
                <span>Owner: {tree.ownerId?.slice(0, 12)}...</span>
                <span>
                  KulDevta: {tree.kulDevta || "—"}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center gap-3 text-xs text-dark/50">
            <span>👥 {tree.totalMembers}</span>
            <span>📊 {tree.generations} gen</span>
          </div>
          <p className="mt-1 text-xs text-dark/30">{formatDate(tree.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role = "viewer" }: { role?: string | null }) {
  if (role === "owner") {
    return (
      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
        OWNER
      </span>
    );
  }
  if (role === "branch_editor") {
    return (
      <span className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-bold text-info">
        EDITOR
      </span>
    );
  }
  return null;
}

function TreeStatusBadge({ status = "active" }: { status?: string | null }) {
  if (status === "active") {
    return (
      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
        ACTIVE
      </span>
    );
  }
  if (status === "deleted") {
    return (
      <span className="rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error">
        DELETED
      </span>
    );
  }
  if (status === "merged") {
    return (
      <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
        MERGED
      </span>
    );
  }
  return null;
}

function StatusBadge({ status = "pending" }: { status?: string | null }) {
  if (status === "approved") {
    return (
      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
        APPROVED
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-bold text-error">
        REJECTED
      </span>
    );
  }
  return (
    <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning">
      PENDING
    </span>
  );
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return dateStr;
  }
}
