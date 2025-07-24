import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateManager } from "@/components/admin/TemplateManager";
import { TemplatePreview } from "@/components/admin/TemplatePreview";
import { DepartmentTemplates } from "@/components/admin/DepartmentTemplates";
import { AdminLogin } from "@/components/auth/AdminLogin";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminAuthenticated") === "true";
    setIsAuthenticated(isLoggedIn);
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <Logo size="lg" />
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage appraisal templates and performance indicators
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Main
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">Template Manager</TabsTrigger>
              <TabsTrigger value="departments">Department Templates</TabsTrigger>
              <TabsTrigger value="preview">Template Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Appraisal Template Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <TemplateManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments">
              <Card>
                <CardHeader>
                  <CardTitle>Department-Specific Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <DepartmentTemplates />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <TemplatePreview />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;