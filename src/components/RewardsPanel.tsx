
import { useExpenseStore } from '@/store/expenseStore';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Star, Trophy } from 'lucide-react';

const RewardsPanel = () => {
  const { achievements, getUserLevel } = useExpenseStore();
  const userLevel = getUserLevel();
  const earnedAchievements = achievements.filter(a => a.earned);
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-4">
      {/* Level and Progress */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Level {userLevel}</h3>
            <p className="text-sm text-slate-600">Budget Manager</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
            {earnedAchievements.length}/{totalAchievements} Badges
          </Badge>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`transition-all duration-200 ${
              achievement.earned 
                ? 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm' 
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${
                    achievement.earned ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    achievement.earned ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && achievement.earnedDate && (
                    <div className="flex items-center mt-2">
                      <Star className="w-3 h-3 text-slate-500 mr-1" />
                      <span className="text-xs text-slate-600">
                        Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {earnedAchievements.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Start tracking expenses to earn your first badge!</p>
          <p className="text-sm text-slate-500 mt-1">Each achievement unlocks as you use the app</p>
        </div>
      )}
    </div>
  );
};

export default RewardsPanel;
