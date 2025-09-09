import { useEffect, useState, useMemo } from 'react'
import { COLORS, FONTS } from '../../constants/ui constants'
import add from '../../assets/add.png'
import LandCards from '../../components/Lands/LandCards'
import LandView from '../../components/Lands/LandView'
import { useAppDispatch, useAppSelector } from '../../Hooks/redux'
import { DeleteLandsThunks, GetLandsDetailsThunks } from '../../features/lands/redux/thunks'
import type { LandsDetails } from '../../features/lands/type'
import type { RootState } from '../../store/store'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/input'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import searchImg from '../../assets/properties/search.png'
import { GetLocalStorage } from '../../utils/localstorage'
// import axios from 'axios'

type ModalMode = 'add' | 'view' | 'edit';

const LandHome = () => {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<LandsDetails | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUUID, setDeleteUUID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [,] = useState();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const rowsPerPageOptions = [6, 12, 24];

  const dispatch = useAppDispatch()
  const landsData: LandsDetails[] = useAppSelector((state: RootState) => state.landstore.lands)

  const handleDeleteProperty = async () => {
    setIsDeleting(true);
    try {
      await dispatch(DeleteLandsThunks(deleteUUID));
      setIsDeleteModalOpen(false);
      toast.success("Land deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete land");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Filtered lands
  const filteredLands = useMemo(() => {
    return landsData.filter((land) => {
      if (!searchTerm) return true;
      const lowerSearch = searchTerm.toLowerCase();
      const searchableText = [
        land.owner_information?.full_name || '',
        land.land_name || '',
        land.land_address || ''
      ].join(' ').toLowerCase();
      return searchableText.includes(lowerSearch);
    });
  }, [landsData, searchTerm]);

  // Pagination calculations
  const totalItems = filteredLands.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedLands = filteredLands.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(GetLandsDetailsThunks())
  }, [dispatch]);

  const role = GetLocalStorage('role')


  return (
    <div className='p-3'>
      {/* Header + Add Button */}
      <div className="flex flex-col gap-5">
        <div className='flex flex-row justify-between items-center'>
          <div>
            <p style={{ ...FONTS.headers }}>Land</p>
            <p style={{ ...FONTS.headers_description }} className='!text-[#7D7D7D]'>Manage Your Property Portfolio</p>
          </div>
          <div
            className={`flex flex-row hover:bg-[#ed3237] bg-red-700 p-2 rounded-lg cursor-pointer ${role === 'admin' || role === 'manager' ? `bg-red-700 opacity-50 cursor-not-allowed` : ``}`}
            onClick={() => {
              if (role === "admin" || role === "manager") {
                return;
              }
              setModalMode("add");
              setOpenViewModal(true);
              setSelectedProperty(null);
            }}
            style={{ background: COLORS.primary_purple }}>
            <img src={add} alt="" />
            <p className='text-white  px-2'>Add Land</p>
          </div>
        </div>

        {/* Search bar */}
        <div className='relative max-w-md flex-1'>
          <img
            src={searchImg}
            className='absolute left-3 top-7 transform -translate-y-1/2 text-gray-400 w-4 h-4'
            alt="Search"
          />
          <Input
            placeholder='Search by tenant name'
            className='pl-10 h-10 w-[80%] bg-[#ed32370d] border-[#ed32370d] text-[#333333] placeholder-[#333333] rounded-lg focus-visible:ring-[#000] focus-visible:border-[#000]'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button
              onClick={resetSearch}
              className='absolute right-24 top-7 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:ring-[#000] focus-visible:border-[#000]'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>

      {/* Land Cards Grid */}
      <div className="mt-5 grid grid-cols-2 gap-5">
        {paginatedLands.length > 0 ? (
          paginatedLands.map((item, index) => (
            <div key={index}>
              <LandCards
                property={item}
                setOpenViewModal={setOpenViewModal}
                setModalMode={setModalMode}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setSelectedProperty={setSelectedProperty}
                setDeleteUUID={setDeleteUUID}
              />
            </div>
          ))
        ) : (
          <div className='col-span-2 text-center py-8'>
            <p className='text-lg text-gray-500'>
              No lands found matching your search criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 border-t border-gray-200 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#7D7D7D]">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-[#7D7D7D]">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${page === currentPage
                        ? "bg-[#ed3237] text-white border-[#ed3237]"
                        : "border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {openViewModal && (
        <LandView
          openViewModal={openViewModal}
          setOpenViewModal={setOpenViewModal}
          modalMode={modalMode}
          selectedProperty={selectedProperty}
          setSelectedProperty={setSelectedProperty}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-[#7D7D7D] mb-6">
                Are you sure you want to delete this land? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-red-600 rounded-lg text-white hover:bg-red-400 transition-colors"
                  onClick={handleDeleteProperty}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default LandHome
