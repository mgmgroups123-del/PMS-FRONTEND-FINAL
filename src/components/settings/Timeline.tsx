import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { getallactivity } from "../../features/settings/service";
import { FONTS } from "../../constants/ui constants";

interface TimelineItem {
  action: string;
  title: string;
  details: string;
  date: string;
}

export default function Timeline() {
  const [activityList, setActivityList] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); 
  const [totalItems, setTotalItems] = useState(0);   

  const fetchAllActivity = async (currentPage: number, limit: number) => {
    try {
      setLoading(true);
      const response = await getallactivity({
        page: currentPage,
        perpage: limit, 
      });

      console.log("API response:", response);

      if (response?.data) {
        const formattedData = response.data.map((item: any) => ({
          title: item.title || "No Title",
          details: item.details || item.message || "",
          date: item.createdAt || new Date().toLocaleString(),
          action: item.action,
        }));

        setActivityList(formattedData);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.totalItems || response?.count || formattedData.length); 
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActivity(page, rowsPerPage);
  }, [page, rowsPerPage]);

  if (loading) {
    return <p className="text-gray-500">Loading activities...</p>;
  }

  if (activityList.length === 0) {
    return <p className="text-gray-500">No activity found.</p>;
  }

  return (
    <div className="space-y-8 relative h-105 overflow-auto scrollbar-hide">
      {activityList.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 relative"
        >
          <div className="flex flex-col items-center">
            <div
              className="bg-teal-600 text-white px-4 py-1 rounded-md font-semibold text-center w-40"
              style={{ ...FONTS.Table_Header }}
            >
              {item?.action}
            </div>

            <div className="w-3 h-3 rounded-full bg-teal-600 mt-2"></div>

            {index !== activityList.length - 1 && (
              <div className="w-[2px] bg-teal-600 flex-grow min-h-[150px]"></div>
            )}
          </div>

          <Card className="flex-1 border border-teal-500 mt-8">
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <p
                  className="font-semibold"
                  style={{ ...FONTS.Table_Header, fontSize: "20px" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ ...FONTS.large_card_description3 }}
                >
                  {item.details}
                </p>
              </div>
              <p
                className="text-xs text-gray-500"
                style={{ ...FONTS.large_card_description3 }}
              >
                {new Date(item.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}

    
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

    
        <div className="flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-full shadow-md transition-all duration-200 ${
              page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#ed3237] text-white hover:bg-[#9800cc] active:scale-95"
            }`}
          >
            ⬅ Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-full shadow-md transition-all duration-200 ${
              page === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#ed3237] text-white hover:bg-[#ed3237] active:scale-95"
            }`}
          >
            Next ➡
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * rowsPerPage + 1}–
          {Math.min(page * rowsPerPage, totalItems)} of {totalItems}
        </div>
      </div>
    </div>
  );
}
