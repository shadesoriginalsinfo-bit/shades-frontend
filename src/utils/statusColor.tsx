import { Badge } from "@/components/ui/badge";

const SUBSTATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING_L2: {
    label: "Pending with L2",
    className: "bg-yellow-100 text-yellow-700",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-700",
  },
  DISCUSS: {
    label: "Discuss",
    className: "bg-blue-100 text-blue-700",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
  ONGOING: {
    label: "Ongoing",
    className: "bg-yellow-100 text-yellow-700",
  },
  SUBMITED: {
    label: "Submited",
    className: "bg-yellow-100 text-yellow-700",
  },
  ALLOCATED: {
    label: "Allocated",
    className: "bg-green-100 text-green-700",
  },
  PENDING_L1: {
    label: "Pending with L1",
    className: "bg-yellow-100 text-yellow-700",
  },
  ALLOTED: {
    label: "Alloted",
    className: "bg-green-100 text-green-700",
  },
  BLOCKED: {
    label: "Blocked",
    className: "bg-red-100 text-red-700",
  },
  HOLIDAY: {
    label: "Holiday",
    className: "bg-yellow-100 text-yellow-700",
  },
};

type StatusBadgeProps = {
  status?: string;
  noColour?: boolean;
};

export function StatusBadge({ status, noColour = false }: StatusBadgeProps) {
  if (!status) {
    return <Badge variant="secondary">-</Badge>;
  }

  const config = SUBSTATUS_CONFIG[status];

  // fallback for unknown statuses
  if (!config) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-700">
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      className={noColour ? "bg-gray-100 text-gray-700" : config.className}
    >
      {config.label}
    </Badge>
  );
}
