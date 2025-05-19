// components/Controls.js
import { ChevronDown, Shuffle, Search } from 'lucide-react';

const Controls = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  allCategories,
  onRandomize,
  itemsPerPage,
  onItemsPerPageChange,
  totalProjects
}) => {
  return (
    <div className="mb-8 p-6 bg-slate-800/80 backdrop-blur-md rounded-xl shadow-2xl sticky top-4 z-50 border border-slate-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search Input */}
        <div className="relative">
          <label htmlFor="search" className="block text-sm font-medium text-slate-300 mb-1">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by title, desc, category..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-400"
          />
          <Search className="absolute left-3 top-1/2 transform translate-y-1/4 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={onCategoryChange}
            className="w-full pl-3 pr-10 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none transition-colors"
          >
            {allCategories.map(category => (
              <option key={category} value={category} className="bg-slate-700">
                {category}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform translate-y-1/4 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>

        {/* Items Per Page Selector */}
        <div className="relative">
            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-slate-300 mb-1">Show</label>
            <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={onItemsPerPageChange}
                className="w-full pl-3 pr-10 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 appearance-none transition-colors"
            >
                {[10, 20, 50, 100].map(num => (
                    <option key={num} value={num} className="bg-slate-700">{num} per page</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform translate-y-1/4 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
        
        {/* Randomize Button */}
        <div>
          <button
            onClick={onRandomize}
            disabled={totalProjects === 0} // Disable if no projects
            className="w-full flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="mr-2 w-5 h-5" /> Randomize Current View
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
