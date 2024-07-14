import { apiService } from '../components/api/apiservice'; // Adjust the import path as necessary

// Fetch categories from the server
export const fetchCategories = async () => {
    try {
        const response = await apiService.get('/kaizen/categories');
        if (Array.isArray(response.categories)) {
            console.log('Fetched categories is categories:', response.categories); // Debugging line
            return response.categories;
        } else {
            console.log('Invalid categories data:', response);
            console.error('Invalid categories data:', response.categories);
            return [];
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Add a new category
export const addCategory = async (categoryName: string) => {
    try {
        const response = await apiService.post('/kaizen/categories', { id: Math.random(), title: categoryName });
        return response.category; // Assuming the API returns the added category
    } catch (error) {
        console.error('Error adding category:', error);
        return null;
    }
};

// Delete a category by ID
export const deleteCategory = async (categoryId: number) => {
    try {
        await apiService.delete(`/kaizen/categories/${categoryId}`);
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
};

// Update a category by ID
export const updateCategory = async (categoryId: number, categoryName: string) => {
    try {
        const response = await apiService.put(`/kaizen/categories/${categoryId}`, {id: categoryId, title: categoryName });
        return response.data; // Assuming the API returns the updated category
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
};