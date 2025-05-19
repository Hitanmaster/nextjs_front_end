// agency-showcase/pages/index.js
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import Controls from '../components/Controls';

export default function AgencyShowcasePage() {
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [allCategories, setAllCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default items per page
  const [error, setError] = useState(null);

  // Debounce search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  // Fetch projects from the API
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        category: selectedCategory,
        searchTerm: debouncedSearchTerm,
        // sortBy: 'title', // Example: you can add sort state
        // sortOrder: 'asc',
      });
      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDisplayedProjects(data.projects);
      setTotalPages(data.totalPages);
      setTotalProjects(data.totalProjects);
      if (data.categories && data.categories.length > 0) {
        setAllCategories(data.categories);
      }
    } catch (e) {
      console.error("Failed to fetch projects:", e);
      setError(e.message || "Failed to load projects. Please try again later.");
      setDisplayedProjects([]); // Clear projects on error
      setTotalPages(0);
      setTotalProjects(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedCategory, debouncedSearchTerm]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Dependencies are managed by useCallback

  // Handlers for controls
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Debouncing will handle resetting page and fetching
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset to first page on category change
  };
  
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const handleRandomizeCurrentView = () => {
    // This randomizes only the currently displayed set of projects on the client-side
    setDisplayedProjects(prevProjects => [...prevProjects].sort(() => Math.random() - 0.5));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // fetchProjects will be called by the useEffect due to currentPage change
  };

  return (
    <>
      <Head>
        <title>Agency Project Showcase | Scalable</title>
        <meta name="description" content="Browse through our agency's extensive portfolio of projects with pagination and filtering." />
        <link rel="icon" href="/favicon.ico" /> {/* Make sure favicon.ico is in your /public folder */}
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 md:p-8 font-sans">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
            Our Creative Portfolio
          </h1>
          <p className="text-lg text-slate-400">Explore thousands of innovative projects by our agency.</p>
        </header>

        <Controls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          allCategories={allCategories}
          onRandomize={handleRandomizeCurrentView}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalProjects={totalProjects}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
            <p className="ml-4 text-xl text-slate-400">Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-700 rounded-lg p-6">
            <ImageIcon className="w-16 h-16 mx-auto text-red-400 mb-4" />
            <p className="text-xl text-red-300">Error Loading Projects</p>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
                onClick={fetchProjects}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
                Try Again
            </button>
          </div>
        ) : displayedProjects.length > 0 ? (
          <>
            {/* Masonry Grid for Projects */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6">
              {displayedProjects.map((project, index) => (
                // Added a more unique key combining title, index, and currentPage to help React with re-renders on page change.
                <ProjectCard key={`${project.title}-${index}-${currentPage}`} project={project} />
              ))}
            </div>
            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-slate-500 mb-4" />
            <p className="text-xl text-slate-400">No projects found matching your criteria.</p>
            <p className="text-slate-500">Try adjusting your search or filter, or check back later.</p>
          </div>
        )}
        
        <footer className="text-center mt-12 py-6 border-t border-slate-700">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Your Agency Name. All rights reserved.</p>
        </footer>
      </div>
      {/* Global styles for custom scrollbar, can also be in styles/globals.css */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; // slate-800 (Tailwind color)
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #38bdf8; // sky-400 (Tailwind color)
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9; // sky-500 (Tailwind color)
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #38bdf8 #1e293b;
        }
      `}</style>
    </>
  );
}
