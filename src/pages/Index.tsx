import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { Settings, Users, BarChart3, Shield, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Logo size="md" />
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/login")}
                className="flex items-center gap-2"
              >
                Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin Panel
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Staff Performance Appraisal System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive KPI-based performance evaluation tool for all organizations. Simple, fair, and scalable.
          </p>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 rounded-lg bg-card border">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">
                Different access levels for employees, managers, and administrators
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">KPI Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive performance metrics and goal tracking
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your appraisal data is protected with enterprise-grade security
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive interface that makes performance reviews simple
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-card border rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of organizations using L.U.A.S for fair, transparent, and efficient performance appraisals.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/login")}
                className="px-8"
              >
                Sign In to Your Account
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/admin")}
                className="px-8"
              >
                Admin Access
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Lightweight • Fair • Scalable across all organizations</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
