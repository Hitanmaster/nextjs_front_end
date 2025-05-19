// pages/api/projects.js
import fs from 'fs';
import path from 'path';

// Path to the data file
const dataFilePath = path.join(process.cwd(), 'data', 'pentagram-data.json');

// Helper function to read data from the JSON file
const readProjectsData = () => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading or parsing projects data:", error);
    return []; // Return empty array on error
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      let allProjects = readProjectsData(); // Read all projects from the file

      // Get query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20; // Default items per page
      const category = req.query.category || 'All';
      const searchTerm = (req.query.searchTerm || '').toLowerCase();
      const sortBy = req.query.sortBy || 'title'; // e.g., title, date (if available)
      const sortOrder = req.query.sortOrder || 'asc'; // asc or desc
      const randomize = req.query.randomize === 'true';


      // --- Filtering ---
      let filteredProjects = allProjects;

      if (category !== 'All') {
        filteredProjects = filteredProjects.filter(project =>
          project.categories && project.categories.includes(category)
        );
      }

      if (searchTerm) {
        filteredProjects = filteredProjects.filter(project =>
          (project.title && project.title.toLowerCase().includes(searchTerm)) ||
          (project.description && project.description.toLowerCase().includes(searchTerm)) ||
          (project.categories && project.categories.some(cat => cat.toLowerCase().includes(searchTerm)))
        );
      }
      
      // --- Sorting ---
      // (Add more sophisticated sorting if date fields or other sortable fields exist)
      filteredProjects.sort((a, b) => {
        let valA = a[sortBy] ? a[sortBy].toLowerCase() : '';
        let valB = b[sortBy] ? b[sortBy].toLowerCase() : '';

        if (valA < valB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
      
      // --- Randomization ---
      // Apply randomization *after* filtering but *before* pagination if requested globally
      // For client-side randomization of the current view, this API part is not strictly needed
      // but can be used if a "globally random page" is desired.
      if (randomize) {
        // This shuffles the *entire filtered list* before pagination.
        // For very large datasets, this might be slow.
        // Consider if randomization should only apply to the currently visible client-side items.
        for (let i = filteredProjects.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredProjects[i], filteredProjects[j]] = [filteredProjects[j], filteredProjects[i]];
        }
      }


      // --- Pagination ---
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
      const totalProjects = filteredProjects.length;
      const totalPages = Math.ceil(totalProjects / limit);
      
      // --- Get all unique categories for the filter dropdown ---
      const categoriesSet = new Set();
      allProjects.forEach(project => { // Use allProjects for complete category list
        project.categories?.forEach(cat => categoriesSet.add(cat));
      });
      const uniqueCategories = ['All', ...Array.from(categoriesSet).sort()];

      res.status(200).json({
        projects: paginatedProjects,
        currentPage: page,
        totalPages: totalPages,
        totalProjects: totalProjects,
        categories: uniqueCategories, // Send available categories to the client
      });

    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
