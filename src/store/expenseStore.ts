
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  time: string;
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface ExpenseStore {
  expenses: Expense[];
  monthlyBudget: number;
  categories: string[];
  achievements: Achievement[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  setMonthlyBudget: (budget: number) => void;
  addCategory: (category: string) => void;
  totalSpent: number;
  getUserLevel: () => number;
  getAchievements: () => Achievement[];
  checkAchievements: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Step',
    description: 'Record your first expense',
    icon: '🎯',
    earned: false,
  },
  {
    id: '2',
    title: 'Budget Setter',
    description: 'Set your first monthly budget',
    icon: '💰',
    earned: false,
  },
  {
    id: '3',
    title: 'Consistent Tracker',
    description: 'Log expenses for 7 consecutive days',
    icon: '🔥',
    earned: false,
  },
  {
    id: '4',
    title: 'Budget Master',
    description: 'Stay within budget for a full month',
    icon: '👑',
    earned: false,
  },
  {
    id: '5',
    title: 'Category Expert',
    description: 'Use 5 different categories',
    icon: '📊',
    earned: false,
  },
];

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      monthlyBudget: 0,
      categories: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills'],
      achievements: initialAchievements,
      totalSpent: 0,

      addExpense: (expense) => {
        const newExpense = {
          ...expense,
          id: Date.now().toString(),
        };
        
        set((state) => {
          const newExpenses = [...state.expenses, newExpense];
          const totalSpent = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          return {
            expenses: newExpenses,
            totalSpent,
          };
        });
        
        get().checkAchievements();
      },

      removeExpense: (id) => {
        set((state) => {
          const newExpenses = state.expenses.filter(exp => exp.id !== id);
          const totalSpent = newExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          
          return {
            expenses: newExpenses,
            totalSpent,
          };
        });
      },

      setMonthlyBudget: (budget) => {
        set({ monthlyBudget: budget });
        get().checkAchievements();
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      getUserLevel: () => {
        const { expenses, achievements } = get();
        const earnedAchievements = achievements.filter(a => a.earned).length;
        const expenseCount = expenses.length;
        
        return Math.floor((expenseCount + earnedAchievements * 5) / 10) + 1;
      },

      getAchievements: () => {
        return get().achievements.filter(a => a.earned);
      },

      checkAchievements: () => {
        set((state) => {
          const updatedAchievements = state.achievements.map(achievement => {
            if (achievement.earned) return achievement;

            let shouldEarn = false;
            const today = new Date().toISOString().split('T')[0];

            switch (achievement.id) {
              case '1':
                shouldEarn = state.expenses.length >= 1;
                break;
              case '2':
                shouldEarn = state.monthlyBudget > 0;
                break;
              case '3':
                shouldEarn = state.expenses.length >= 7;
                break;
              case '4':
                shouldEarn = state.monthlyBudget > 0 && state.totalSpent <= state.monthlyBudget;
                break;
              case '5':
                const uniqueCategories = new Set(state.expenses.map(e => e.category));
                shouldEarn = uniqueCategories.size >= 5;
                break;
            }

            if (shouldEarn) {
              return {
                ...achievement,
                earned: true,
                earnedDate: today,
              };
            }

            return achievement;
          });

          return {
            achievements: updatedAchievements,
          };
        });
      },
    }),
    {
      name: 'expense-storage',
    }
  )
);
