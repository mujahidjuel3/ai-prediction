import { Avatar } from "@/components/ui/avatar";

interface StudentIdentityProps {
  name: string;
  secondary: string;
}

export function StudentIdentity({ name, secondary }: StudentIdentityProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} size="sm" />
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{name}</p>
        <p className="truncate text-xs text-slate-500">{secondary}</p>
      </div>
    </div>
  );
}
