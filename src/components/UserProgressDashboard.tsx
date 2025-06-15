
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGamification } from "@/hooks/useGamification";
import { Star, Trophy, Crown, TrendingUp, Target, Gamepad } from "lucide-react";

export const UserProgressDashboard = () => {
  const { 
    userProgression, 
    achievements, 
    userAchievements, 
    getProgressToNextLevel,
    isLoadingProgression 
  } = useGamification();

  const progressToNext = getProgressToNextLevel();
  const recentAchievements = userAchievements.slice(0, 3);

  if (isLoadingProgression) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getLevelIcon = (level: number) => {
    if (level >= 10) return Crown;
    if (level >= 5) return Trophy;
    return Star;
  };

  const LevelIcon = getLevelIcon(userProgression?.level || 1);

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <LevelIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Level {userProgression?.level || 1}</h2>
                <p className="text-blue-100">{userProgression?.total_points || 0} total points</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Progress to Level {(userProgression?.level || 1) + 1}</p>
              <div className="w-32 mb-2">
                <Progress 
                  value={progressToNext.percentage} 
                  className="h-2 bg-white/20"
                />
              </div>
              <p className="text-xs text-blue-100">
                {progressToNext.current}/{progressToNext.required} points
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
            <Gamepad className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgression?.templates_used || 0}</div>
            <p className="text-xs text-muted-foreground">
              50 points each
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Created</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgression?.campaigns_created || 0}</div>
            <p className="text-xs text-muted-foreground">
              100 points each
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAchievements.length}</div>
            <p className="text-xs text-muted-foreground">
              out of {achievements.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Your latest unlocked achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((userAchievement) => (
                <div key={userAchievement.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{userAchievement.achievement?.name}</p>
                      <p className="text-sm text-gray-600">{userAchievement.achievement?.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    +{userAchievement.achievement?.points_reward} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Level Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Level Benefits
          </CardTitle>
          <CardDescription>Unlock new features as you level up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: 1, benefit: "Access to Spin Wheel templates", unlocked: (userProgression?.level || 1) >= 1 },
              { level: 2, benefit: "Scratch Card templates unlocked", unlocked: (userProgression?.level || 1) >= 2 },
              { level: 3, benefit: "Slot Machine templates available", unlocked: (userProgression?.level || 1) >= 3 },
              { level: 4, benefit: "Memory Game templates", unlocked: (userProgression?.level || 1) >= 4 },
              { level: 5, benefit: "Interactive Quiz templates + Crown badge", unlocked: (userProgression?.level || 1) >= 5 },
              { level: 10, benefit: "Exclusive Master templates + Crown icon", unlocked: (userProgression?.level || 1) >= 10 }
            ].map((item) => (
              <div key={item.level} className={`flex items-center justify-between p-3 rounded-lg ${
                item.unlocked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Badge variant={item.unlocked ? "default" : "secondary"}>
                    Level {item.level}
                  </Badge>
                  <span className={item.unlocked ? "text-green-800" : "text-gray-600"}>
                    {item.benefit}
                  </span>
                </div>
                {item.unlocked && (
                  <Star className="w-5 h-5 text-green-600 fill-current" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
