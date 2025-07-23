import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AppraisalTemplate } from "./TemplateManager";
import { useToast } from "@/hooks/use-toast";
import { Building, Users, Copy } from "lucide-react";

const DEPARTMENTS = [
  { id: "it", name: "Information Technology", icon: "💻" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "procurement", name: "Procurement", icon: "🛒" },
  { id: "hr", name: "Human Resources", icon: "👥" },
  { id: "sales", name: "Sales", icon: "📈" },
  { id: "marketing", name: "Marketing", icon: "📊" },
  { id: "operations", name: "Operations", icon: "⚙️" },
  { id: "customer-service", name: "Customer Service", icon: "🎧" }
];

const DEPARTMENT_KPIS = {
  it: [
    { name: "Technical Expertise", description: "Knowledge of programming languages, tools, and technologies", weight: 25 },
    { name: "Problem Solving", description: "Ability to debug and resolve technical issues", weight: 20 },
    { name: "Code Quality", description: "Writing clean, maintainable, and efficient code", weight: 20 },
    { name: "Project Delivery", description: "Meeting deadlines and delivering projects on time", weight: 15 },
    { name: "Innovation", description: "Implementing new technologies and best practices", weight: 10 },
    { name: "Documentation", description: "Creating and maintaining technical documentation", weight: 10 }
  ],
  finance: [
    { name: "Financial Analysis", description: "Ability to analyze financial data and trends", weight: 25 },
    { name: "Accuracy", description: "Precision in financial calculations and reporting", weight: 25 },
    { name: "Compliance", description: "Adherence to financial regulations and standards", weight: 20 },
    { name: "Risk Management", description: "Identifying and mitigating financial risks", weight: 15 },
    { name: "Process Improvement", description: "Streamlining financial processes", weight: 10 },
    { name: "Stakeholder Communication", description: "Clear reporting to management and stakeholders", weight: 5 }
  ],
  procurement: [
    { name: "Vendor Management", description: "Building and maintaining supplier relationships", weight: 25 },
    { name: "Cost Optimization", description: "Achieving cost savings and value for money", weight: 25 },
    { name: "Contract Negotiation", description: "Effective negotiation of terms and conditions", weight: 20 },
    { name: "Quality Assurance", description: "Ensuring supplier quality standards", weight: 15 },
    { name: "Market Research", description: "Staying informed about market trends and prices", weight: 10 },
    { name: "Risk Mitigation", description: "Managing supplier and procurement risks", weight: 5 }
  ]
};

export const DepartmentTemplates = () => {
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departmentTemplates, setDepartmentTemplates] = useState<AppraisalTemplate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedTemplates = localStorage.getItem('appraisal-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      const deptTemplates = templates.filter(t => t.department === selectedDepartment);
      setDepartmentTemplates(deptTemplates);
    } else {
      setDepartmentTemplates([]);
    }
  }, [selectedDepartment, templates]);

  const createDepartmentTemplate = (department: string) => {
    const deptInfo = DEPARTMENTS.find(d => d.id === department);
    if (!deptInfo) return;

    const defaultKPIs = DEPARTMENT_KPIS[department as keyof typeof DEPARTMENT_KPIS] || [];
    
    const newTemplate: AppraisalTemplate = {
      id: `dept-${department}-${Date.now()}`,
      name: `${deptInfo.name} Staff Appraisal`,
      description: `Performance evaluation template specifically designed for ${deptInfo.name} department`,
      type: "staff",
      department: department,
      kpis: defaultKPIs.map((kpi, index) => ({
        id: `kpi-${index}`,
        name: kpi.name,
        description: kpi.description,
        weight: kpi.weight
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('appraisal-templates', JSON.stringify(updatedTemplates));

    toast({
      title: "Success",
      description: `Template created for ${deptInfo.name} department`
    });
  };

  const duplicateTemplate = (template: AppraisalTemplate) => {
    const newTemplate: AppraisalTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('appraisal-templates', JSON.stringify(updatedTemplates));

    toast({
      title: "Success",
      description: "Template duplicated successfully"
    });
  };

  const getDepartmentStats = () => {
    const stats = DEPARTMENTS.map(dept => ({
      ...dept,
      templateCount: templates.filter(t => t.department === dept.id).length,
      hasDefault: DEPARTMENT_KPIS.hasOwnProperty(dept.id)
    }));
    return stats;
  };

  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getDepartmentStats().map((dept) => (
          <Card key={dept.id} className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedDepartment(dept.id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{dept.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{dept.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {dept.templateCount} templates
                    </Badge>
                    {dept.hasDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default KPIs
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Selection */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="department">Select Department</Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a department to manage templates" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.icon} {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedDepartment && DEPARTMENT_KPIS[selectedDepartment as keyof typeof DEPARTMENT_KPIS] && (
          <Button 
            onClick={() => createDepartmentTemplate(selectedDepartment)}
            className="mt-6"
          >
            <Building className="h-4 w-4 mr-2" />
            Create Default Template
          </Button>
        )}
      </div>

      {/* Department Templates */}
      {selectedDepartment && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              {DEPARTMENTS.find(d => d.id === selectedDepartment)?.name} Templates
            </h3>
            <Badge variant="outline">
              {departmentTemplates.length} template{departmentTemplates.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {departmentTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-medium mb-2">No templates found</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a template specifically designed for this department's needs.
                </p>
                {DEPARTMENT_KPIS[selectedDepartment as keyof typeof DEPARTMENT_KPIS] && (
                  <Button onClick={() => createDepartmentTemplate(selectedDepartment)}>
                    <Building className="h-4 w-4 mr-2" />
                    Create Default Template
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {departmentTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{template.type}</Badge>
                        <Badge variant="outline">{template.department}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Department-Specific KPIs:</p>
                        <div className="grid gap-2 md:grid-cols-2">
                          {template.kpis.map((kpi) => (
                            <div key={kpi.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex-1">
                                <span className="text-sm font-medium">{kpi.name}</span>
                                <p className="text-xs text-muted-foreground">{kpi.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {kpi.weight}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => duplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Default KPIs Preview */}
      {selectedDepartment && DEPARTMENT_KPIS[selectedDepartment as keyof typeof DEPARTMENT_KPIS] && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Default KPIs for {DEPARTMENTS.find(d => d.id === selectedDepartment)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {DEPARTMENT_KPIS[selectedDepartment as keyof typeof DEPARTMENT_KPIS].map((kpi, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{kpi.name}</span>
                    <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {kpi.weight}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};