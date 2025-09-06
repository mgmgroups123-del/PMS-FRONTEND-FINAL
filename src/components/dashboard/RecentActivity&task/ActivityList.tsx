import { Building2 } from "lucide-react";
import dayjs from "dayjs";
import { FONTS } from "../../../constants/ui constants";

interface ActivityItem {
  id?: string; // Made optional
  title: string;
  details: string;
  createdAt: string;
  action: string;
}

interface ActivityListProps {
  data: ActivityItem[];
  getStatusBadgeStyles: (status: string) => string;
}

export default function ActivityList({
  data,
  getStatusBadgeStyles,
}: ActivityListProps) {
  return (
    <div>
      {/* Headers */}
      <div className="hidden md:grid grid-cols-[2fr,3fr,1fr,1fr] gap-4 text-gray-600 font-medium mb-4 border shadow-lg p-4 rounded-lg items-center text-center sticky top-0 bg-white z-10">
        <div className="text-left">Title</div>
        <div className="text-left">Details</div>
        <div className="text-center">Time</div>
        <div className="text-center">Action</div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 justify-center">
        {data?.length > 0 ? (
          data?.slice(0, 5).map((item, index) => (
            <div
              key={item.id || `activity-${index}`} // Use index as fallback
              className="grid grid-cols-[2fr,3fr,1fr,1fr] gap-4 p-4 border rounded-lg shadow-lg hover:shadow-md transition items-center"
            >
              {/* Title with icon */}
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBadgeStyles(
                    item.action
                  )}`}
                >
                  <Building2 />
                </div>
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>

              {/* Details */}
              <div className="text-gray-700 text-left">{item.details}</div>

              {/* Time */}
              <div className="text-gray-700 text-center">
                {dayjs(item.createdAt).format("hh:mm A")}
              </div>

              {/* Action */}
              <div className="text-center">
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusBadgeStyles(
                    item.action
                  )}`}
                >
                  {item.action}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center">
            <p className="" style={{ ...FONTS.card_headers }}>
              Activity log data not found...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
