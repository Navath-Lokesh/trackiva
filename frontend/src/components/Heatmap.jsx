import { useEffect, useState } from "react";
import { getHeatmap } from "../api/analyticsApi";

export default function Heatmap() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const fetchHeatmap = async () => {
    try {
      const res = await getHeatmap();
      setData(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getColor = (count) => {
    if (count === 0) return "bg-gray-700";
    if (count < 2) return "bg-green-250";
    if (count < 4) return "bg-green-500";
    return "bg-green-600";
  };

  return (
    <div className="w-full"> {/* ✅ FIX: remove fixed width */}

      {/* Title */}
      <h2 className="text-sm sm:text-base font-semibold mb-3 text-white">
        Consistency Heatmap
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 justify-start"> {/* ✅ FIX: 7 cols */}

        {data.length === 0 ? (
          <p className="text-gray-400 text-xs col-span-7">
            No data yet
          </p>
        ) : (
          data.map((item, index) => (
            <div
              key={index}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${getColor(item.count)} transition`}
              title={`${item.date} → ${item.count}`}
            />
          ))
        )}

      </div>

    </div>
  );
}