import { Building2 } from "lucide-react";

interface TaskItem {
  id: string;
  companyName: string;
  name: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  icon: string;
}

interface TaskListProps {
  data: TaskItem[];
  getIconStyles: (icon: string) => string;
  getPriorityBadgeStyles: (priority: string) => string;
}

export default function TaskList({
  data,
  getIconStyles,
  getPriorityBadgeStyles,
}: TaskListProps) {
  return (
    <div>
      {/* Headers */}
      <div className="hidden md:grid grid-cols-[250px_1fr_1fr_120px] gap-4 text-gray-600 font-medium mb-4 border shadow-lg p-4 rounded-lg">
        <div>Company Name</div>
        <div>Name</div>
        <div>Due Date</div>
        <div>Action</div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[250px_1fr_1fr_120px] gap-4 p-4 border rounded-lg shadow-lg hover:shadow-md transition items-center"
          >
            {/* Company + icon */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconStyles(
                  item.icon
                )}`}
              >
                <Building2 />
              </div>
              <span className="font-medium text-gray-900">
                {item.companyName}
              </span>
            </div>

            <div className="text-gray-700">{item.name}</div>
            <div className="text-gray-700">{item.dueDate}</div>

            <div>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityBadgeStyles(
                  item.priority
                )}`}
              >
                {item.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
