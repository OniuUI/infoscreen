import React, { useState, useEffect } from 'react';
import {addCategory, deleteCategory, fetchCategories, updateCategory} from '../../service/CategoryService';
import { Column } from '../utils/types';

interface EditCategory {
    id: number;
    title: string;
}

interface Props {}

const KaizenSettings: React.FC<Props> = () => {
    const [categories, setCategories] = useState<Column[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<EditCategory | null>(null);

    useEffect(() => {
        const fetchAndSetCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                console.log('Fetched Categories:', fetchedCategories); // Debugging line
                if (fetchedCategories) {
                    setCategories(fetchedCategories);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchAndSetCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        const newCategory = await addCategory(newCategoryName);
        if (newCategory) {
            setCategories([...categories, newCategory]);
        }
        setNewCategoryName('');
    };

    const handleDeleteCategory = async (categoryId: number) => {
        await deleteCategory(categoryId);
        setCategories(categories.filter(category => category.id !== categoryId));
    };

    const handleEditCategory = async (e: React.FormEvent, categoryId: number) => {
        e.preventDefault();
        if (editingCategory && editingCategory.title.trim()) {
            await updateCategory(categoryId, editingCategory.title);
            const updatedCategories = categories.map(category =>
                category.id === categoryId ? { ...category, name: editingCategory.title } : category
            );
            setCategories(updatedCategories);
            setEditingCategory(null); // Reset editing state
        }
    };
    return (
        <div className="max-w-xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Category Settings</h2>
            <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Add new category"
                    className="border border-gray-300 p-2 rounded-md"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Add Category
                </button>
            </form>
            <ul className="mt-6">
                {categories.map(category => (
                    <li key={category.id} className="border-b border-gray-200 last:border-b-0 py-2">
                        {editingCategory?.id === category.id ? (
                            <form onSubmit={(e) => handleEditCategory(e, category.id)} className="flex gap-2">
                                <input
                                    type="text"
                                    value={editingCategory.title}
                                    onChange={(e) => setEditingCategory({...editingCategory, title: e.target.value})}
                                    className="flex-1 border border-gray-300 p-2 rounded-md"
                                />
                                <button type="submit"
                                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Save
                                </button>
                                <button onClick={() => setEditingCategory(null)}
                                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">Cancel
                                </button>
                            </form>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span>{category.title}</span>
                                <div>
                                    <button onClick={() => setEditingCategory({id: category.id, title: category.title})}
                                            className="bg-yellow-500 text-white p-2 rounded-md mr-2 hover:bg-yellow-600">Edit
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.id)}
                                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KaizenSettings;