
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Calendar, TrendingUp, Clock, Bookmark } from "lucide-react";
import ActivityLog from "./ActivityLog";

const AdminDashboard = () => {
  // Mock data - in a real app this would come from an API
  const stats = [
    { 
      title: "Total Documents", 
      value: "124", 
      change: "+12% from last month", 
      icon: FileText,
      color: "bg-blue-100 text-blue-700" 
    },
    { 
      title: "Active Users", 
      value: "2,845", 
      change: "+5% from last month", 
      icon: Users,
      color: "bg-green-100 text-green-700" 
    },
    { 
      title: "Upcoming Events", 
      value: "8", 
      change: "Next: Tomorrow at 2PM", 
      icon: Calendar,
      color: "bg-amber-100 text-amber-700" 
    },
    { 
      title: "Content Views", 
      value: "42.8k", 
      change: "+18% from last month", 
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700" 
    },
    {
      title: "Recent Uploads",
      value: "15",
      change: "In the past 7 days",
      icon: Clock,
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Premium Content",
      value: "67",
      change: "54% of total content",
      icon: Bookmark,
      color: "bg-rose-100 text-rose-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ActivityLog limit={5} />
      </div>
    </div>
  );
};

export default AdminDashboard;
