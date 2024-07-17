import { apiService } from '../components/api/apiservice';
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID"; // Adjust the import path as necessary

// Fetch categories from the server
export const fetchCategories = async () => {
    try {
        const response = await apiService.get('/kaizen/categories');
            return response.categories;

    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Add a new category
export const addCategory = async (categoryName: string, order: number) => {
    try {
        const response = await apiService.post('/kaizen/categories', { title: categoryName, order: order});
        return response.category; // Assuming the API returns the added category
    } catch (error) {
        console.error('Error adding category:', error);
        return null;
    }
};

// Delete a category by ID
export const deleteCategory = async (categoryId: any) => {
    try {
        await apiService.delete(`/kaizen/categories/${categoryId}`);
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
};

// Update a category by ID
export const updateCategory = async (categoryId: string, categoryName: string, order: number) => {
    try {
        // Adjust the API call to match the expected response structure
        const response = await apiService.put(`/kaizen/categories/${categoryId}`, { title: categoryName, order: order});
        // Assuming the API now returns the updated category object directly
        return response.category; // Adjust this line based on the actual response structure
    } catch (error) {
        console.error('Error updating category:', error);
        return null;
    }
};