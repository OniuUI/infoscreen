import React, { useState, useEffect } from 'react';
import { addCategory, deleteCategory, fetchCategories, updateCategory } from '../../service/CategoryService';
import { Column } from '../utils/types';

interface EditCategory {
    id: any;
    title: string;
}

interface Props {}

const KaizenSettings: React.FC<Props> = () => {
    const [categories, setCategories] = useState<Column[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<EditCategory | null>(null);

    useEffect(() => {
        const fetchAndSetCategories = async () => {
            const fetchedCategories = await fetchCategories();
            if (fetchedCategories) {
                setCategories(fetchedCategories);
            }
        };

        fetchAndSetCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        const newCategory = await addCategory(newCategoryName);
        if (newCategory) {
            const updatedCategories = [...categories, newCategory];
            setCategories(updatedCategories);
            // Immediately set the new category as editing category to show the edit view
            setEditingCategory({ id: newCategory.id, title: newCategory.title });
        }
        setNewCategoryName('');
    };

    const handleDeleteCategory = async (categoryId: number) => {
        const success = await deleteCategory(categoryId);
        if (success) {
            setCategories(categories.filter(category => category.id !== categoryId));
        }
    };

    const handleEditCategory = async (e: React.FormEvent, categoryId: string) => {
        e.preventDefault();
        if (editingCategory && editingCategory.title.trim()) {
            const updatedCategory = await updateCategory(categoryId, editingCategory.title);
            console.log('Updated category:', updatedCategory)
            if (updatedCategory) {
                console.log('Updated category:', updatedCategory)
                const index = categories.findIndex(category => category.id === updatedCategory.id);
                if (index !== -1) {
                    const updatedCategories = [
                        ...categories.slice(0, index),
                        updatedCategory,
                        ...categories.slice(index + 1)
                    ];
                    console.log('Updated categories:', updatedCategories);
                    setCategories(updatedCategories);
                }
            }
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
                    <li key={category.id}
                        className="border-b border-gray-200 last:border-b-0 py-2">
                        {editingCategory?.id === category.id ? (
                            <form onSubmit={(e) => handleEditCategory(e, category.id)} className="flex gap-2">
                                <input
                                    type="text"
                                    value={editingCategory?.title || ''}
                                    onChange={(e) => {
                                        if (editingCategory) {
                                            setEditingCategory({
                                                ...editingCategory,
                                                title: e.target.value,
                                                // Ensure _id is always included. If editingCategory is null, this code won't execute.
                                            });
                                        }
                                    }}
                                    className="flex-1 border border-gray-300 p-2 rounded-md"
                                />
                                <button type="submit"
                                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Save
                                </button>
                                <button type="button" onClick={() => setEditingCategory(null)}
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