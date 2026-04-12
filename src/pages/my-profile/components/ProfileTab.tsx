import { User, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuth";
import { formatDate } from "./OrdersTab";


const ProfileTab = () => {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#C6A46C]" />
      </div>
    );
  }

  if (!user) return null;

  const fields = [
    { label: "Full Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Mobile Number", value: user.mobileNumber },
    { label: "Role", value: user.role },
    { label: "Member Since", value: formatDate(user.createdAt) },
  ];

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-[#E8DDD0] rounded-sm overflow-hidden">
        {/* Avatar strip */}
        <div className="bg-linear-to-r from-[#2A1810] to-[#4a2c1a] px-6 py-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#C6A46C]/20 border-2 border-[#C6A46C] flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User size={28} className="text-[#C6A46C]" />
            )}
          </div>
          <div>
            <p className="font-serif font-bold text-white text-xl leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#C6A46C] mt-0.5">
              {user.role}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y divide-[#E8DDD0]">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium w-36 shrink-0">
                {label}
              </span>
              {label === "Role" && user.role === "ADMIN" ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-sm text-[#C6A46C] font-medium hover:underline text-right"
                >
                  {value}
                  <ExternalLink size={13} />
                </Link>
              ) : (
                <span className="text-sm text-gray-800 font-medium text-right">
                  {value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
