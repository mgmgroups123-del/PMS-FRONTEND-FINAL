import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUnitsByPropertyId } from "../../../features/Properties/Reducers/PropertiesThunk";
import { useEffect } from "react";
import { selectUnits } from "../../../features/Properties/Reducers/Selectors";
import { IoMdArrowBack } from "react-icons/io";
import { Building2 } from "lucide-react";

const ViewAllUnits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { property } = location.state || {};
  const dispatch = useDispatch<any>();
  const units = useSelector(selectUnits);

  useEffect(() => {
    if (property?._id) {
      dispatch(fetchUnitsByPropertyId(property._id));
    }
  }, [dispatch, property?._id]);

  const propertyData = property;

  return (
    <div className="bg-white rounded-lg w-full h-full overflow-y-auto no-scrollbar p-6 relative shadow-lg">
      {/* Close Button */}
      <button
        onClick={() => navigate(`/properties`)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ed3237] bg-red-700 text-white "
      >
        <IoMdArrowBack size={14} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <Building2 className="text-blue-500" />
        <h2 className="text-lg font-semibold">{propertyData.name} - Units</h2>
      </div>

      {/* Property Information */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="text-gray-500" />
          <h3 className="text-base font-semibold">Property Information</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Property Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Property Type</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.tag}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Total Units</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={propertyData.stats.totalUnits}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Occupied</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.stats.occupiedUnits}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Vacant</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.stats.vacantUnits}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Square Feet</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={`${propertyData.stats.totalSquareFeet} Sq`}
              readOnly
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.location}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaUser className="text-gray-500" />
          <h3 className="text-base font-semibold">Owner Information</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Owner Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.owner.name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={propertyData.owner.email}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.owner.phone}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Owner Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={propertyData.owner.address}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="mb-6">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#D600A8] text-white text-sm">
              <th className="px-4 py-2 text-left">Unit Name</th>
              <th className="px-4 py-2 text-left">Square Feet</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {units?.length > 0 ? (
              units?.map((unit: any) => (
                <tr key={unit?._id || unit?.uuid} className="border-t">
                  <td className="px-4 py-2">{unit?.unit_name}</td>
                  <td className="px-4 py-2">{unit?.unit_sqft}</td>
                  <td className="px-4 py-2">{unit?.unit_address}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        unit?.status === "vacant"
                          ? "bg-green-100 text-green-800"
                          : unit?.status === "occupied"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {unit?.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  No units found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllUnits;
