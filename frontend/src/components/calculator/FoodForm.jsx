import React, { useState } from 'react';
import { Plus, Trash2, Utensils, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

const FOOD_CATEGORIES = [
  { value: 'vegetarian', label: 'Vegetarian (Plant-based)' },
  { value: 'non_vegetarian', label: 'Non-vegetarian (Meat / Poultry / Seafood)' },
  { value: 'dairy', label: 'Dairy & Eggs' },
  { value: 'other', label: 'Other Food Category' },
];

const FOOD_ITEMS_BY_CATEGORY = {
  vegetarian: [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat / Bread / Flour' },
    { value: 'vegetables', label: 'Mixed Vegetables' },
    { value: 'fruits', label: 'Fresh Fruits' },
    { value: 'other', label: 'Other Plant Food' },
  ],
  non_vegetarian: [
    { value: 'chicken', label: 'Chicken / Poultry' },
    { value: 'fish', label: 'Fish / Seafood' },
    { value: 'mutton', label: 'Mutton / Lamb' },
    { value: 'other', label: 'Other Meat Product' },
  ],
  dairy: [
    { value: 'milk', label: 'Milk' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'other', label: 'Other Dairy / Cheese' },
  ],
  other: [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'other', label: 'Other' },
  ],
};

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
];

export const FoodForm = ({ onAddActivity, activities = [], onRemoveActivity }) => {
  const [foodCategory, setFoodCategory] = useState('vegetarian');
  const [foodItem, setFoodItem] = useState('rice');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg'); // 'kg' or 'grams'
  const [mealType, setMealType] = useState('lunch');
  const [error, setError] = useState('');

  const currentFoodItems = FOOD_ITEMS_BY_CATEGORY[foodCategory] || FOOD_ITEMS_BY_CATEGORY.other;

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setFoodCategory(newCat);
    const items = FOOD_ITEMS_BY_CATEGORY[newCat] || [];
    if (items.length > 0) {
      setFoodItem(items[0].value);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError(`Quantity consumed must be a positive number greater than 0 ${unit}.`);
      return;
    }

    const selectedItemObj = currentFoodItems.find((f) => f.value === foodItem);
    const selectedMeal = MEAL_TYPES.find((m) => m.value === mealType);

    const newActivity = {
      id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'food',
      food_category: foodCategory,
      food_item: foodItem,
      activity_type: foodItem,
      activityName: `${selectedItemObj?.label || foodItem} (${qtyNum} ${unit})`,
      quantity: qtyNum,
      unit: unit,
      meal_type: mealType,
      displaySummary: `${qtyNum} ${unit} • ${selectedMeal?.label || mealType}`,
    };

    onAddActivity(newActivity);
    setQuantity('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Food Category <span className="text-red-500">*</span>
            </label>
            <select
              value={foodCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {FOOD_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Food Item <span className="text-red-500">*</span>
            </label>
            <select
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {currentFoodItems.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Quantity Consumed <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                min="0.01"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. 0.5"
                className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-28 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="grams">Grams (g)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Meal Type
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {MEAL_TYPES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" icon={Plus}>
            Add Food Entry
          </Button>
        </div>
      </form>

      {/* Queued Activities List */}
      {activities.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-text-main uppercase tracking-wider mb-2.5">
            Food Activities in Queue ({activities.length})
          </h4>
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-background border border-border rounded-md flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#5B9377]/10 text-[#5B9377] flex items-center justify-center shrink-0">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-main truncate">{act.activityName}</p>
                    <p className="text-text-secondary">{act.displaySummary}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveActivity(act.id)}
                  aria-label="Remove food activity"
                  className="p-1 text-text-secondary hover:text-red-600 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
