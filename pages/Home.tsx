
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '../components/Sidebar';
import CarCard from '../components/StoreCard'; 
import PromoSlider from '../components/PromoSlider';
import Pagination from '../components/Pagination';
import { MOCK_CARS } from '../data';
import { FilterState, CarRental } from '../types';
import { AlertCircle, ArrowUpDown, ChevronDown, MapPin, BadgeDollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  filters: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
}

const CARS_PER_PAGE = 12;

const Home: React.FC<HomeProps> = ({ filters, onFilterChange }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const filteredCars = useMemo(() => {
    let result = MOCK_CARS.filter(car => {
      if (filters.location && !car.district.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.taxiTypes.length > 0 && !filters.taxiTypes.includes(car.taxiType)) return false;
      if (filters.brands.length > 0) {
        if (!filters.brands.includes(car.model)) return false;
      }
      if (filters.categories.length > 0) {
        const fuelType = car.category === 'HYBRID' ? '混能' : car.category === 'ELECTRIC' ? '新能源' : '石油氣';
        if (!filters.categories.includes(fuelType)) return false;
      }
      if (filters.ageRanges.length > 0 && !filters.ageRanges.includes(car.ageRange)) return false;
      if (filters.specs.length > 0) {
        const matchesSpecs = filters.specs.every(spec => car.seats === parseInt(spec));
        if (!matchesSpecs) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'price') {
        return a.morningPrice - b.morningPrice;
      } else {
        return a.distanceKm - b.distanceKm;
      }
    });

    return result;
  }, [filters, sortBy]);

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE;
    return filteredCars.slice(start, start + CARS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);

  const handleViewStore = (car: CarRental) => {
    navigate(`/taxi/${car.id}`);
  };

  return (
    <>
      <Helmet>
        <title>租的e | 香港領先的專業的士租賃平台</title>
      </Helmet>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <PromoSlider />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <Sidebar filters={filters} onFilterChange={onFilterChange} />
          </div>

          <div className="flex-grow">
            <div className="mb-8 bg-white border border-slate-200 rounded-3xl px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm relative">
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#1A365D]">搜尋結果</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    在 {filters.location || '全香港'} 找到 {filteredCars.length} 款可用車輛
                  </p>
               </div>
               
               <div className="relative">
                  <button 
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all group"
                  >
                     <ArrowUpDown className="w-4 h-4 text-slate-400 group-hover:text-sky-500" />
                     <span className="text-sm font-black text-slate-600">
                        {sortBy === 'price' ? '價格最低優先' : '距離最近優先'}
                     </span>
                     <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${isSortMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isSortMenuOpen && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-[fadeInDown_0.2s_ease-out]">
                      <button 
                        onClick={() => { setSortBy('price'); setIsSortMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-black transition-all ${sortBy === 'price' ? 'text-sky-500 bg-sky-50' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <BadgeDollarSign className="w-4 h-4" />
                        價格最低優先
                      </button>
                      <button 
                        onClick={() => { setSortBy('distance'); setIsSortMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-black transition-all ${sortBy === 'distance' ? 'text-sky-500 bg-sky-50' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <MapPin className="w-4 h-4" />
                        距離最近優先
                      </button>
                    </div>
                  )}
               </div>
            </div>

            {paginatedCars.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedCars.map(car => (
                    <CarCard key={car.id} car={car} onSelect={() => handleViewStore(car)} />
                  ))}
                </div>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </>
            ) : (
              <div className="bg-white rounded-[40px] p-24 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                  <AlertCircle className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">未找到符合條件的車輛</h3>
                <button 
                  onClick={() => onFilterChange({ brands: [], taxiTypes: [], categories: [], specs: [], ageRanges: [], location: '' })}
                  className="px-12 py-5 bg-[#1A365D] text-white font-black rounded-2xl hover:opacity-90 transition-all active:scale-95"
                >
                  清除篩選
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
