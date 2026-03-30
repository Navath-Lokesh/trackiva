import { useEffect, useState } from "react";
import { getHeatmap } from "../api/analyticsApi";

export default function Heatmap() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const fetchHeatmap = async () => {
    const res = await getHeatmap();
    setData(res.data);
  };

  const getColor = (count) => {
    if (count === 0) return "bg-gray-200";
    if (count < 2) return "bg-green-300";
    if (count < 4) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6 w-[370px] h-[180px]">

      <h2 className="text-lg font-semibold mb-4">Consistency Heatmap</h2>

      <div className="grid grid-cols-10 gap-2">

        {data.map((item, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded ${getColor(item.count)}`}
            title={`${item.date} → ${item.count}`}
          />
        ))}

      </div>

    </div>
  );
}