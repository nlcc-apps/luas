import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface KPI {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage weight in overall score
}

export interface AppraisalTemplate {
  id: string;
  name: string;
  description: string;
  type: "staff" | "manager";
  department?: string;
  kpis: KPI[];
  createdAt: string;
  updatedAt: string;
}

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<AppraisalTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('appraisal-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      // Initialize with default templates
      const defaultTemplates: AppraisalTemplate[] = [
        {
          id: "default-staff",
          name: "Standard Staff Appraisal",
          description: "General purpose staff performance evaluation",
          type: "staff",
          kpis: [
            { id: "prod", name: "Productivity & Output", description: "Ability to complete tasks efficiently", weight: 20 },
            { id: "qual", name: "Quality of Work", description: "Accuracy and standard of work delivered", weight: 20 },
            { id: "comm", name: "Communication Skills", description: "Verbal and written communication effectiveness", weight: 15 },
            { id: "team", name: "Teamwork & Collaboration", description: "Ability to work effectively with others", weight: 15 },
            { id: "init", name: "Initiative & Innovation", description: "Proactive approach and creative thinking", weight: 15 },
            { id: "reli", name: "Reliability & Attendance", description: "Punctuality and dependability", weight: 15 }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem('appraisal-templates', JSON.stringify(defaultTemplates));
    }
  }, []);

  const saveTemplates = (updatedTemplates: AppraisalTemplate[]) => {
    setTemplates(updatedTemplates);
    localStorage.setItem('appraisal-templates', JSON.stringify(updatedTemplates));
  };

  const handleCreateTemplate = () => {
    const newTemplate: AppraisalTemplate = {
      id: `template-${Date.now()}`,
      name: "",
      description: "",
      type: "staff",
      kpis: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingTemplate(newTemplate);
    setIsCreating(true);
  };

  const handleEditTemplate = (template: AppraisalTemplate) => {
    setEditingTemplate({ ...template });
    setIsCreating(false);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate || !editingTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive"
      });
      return;
    }

    const totalWeight = editingTemplate.kpis.reduce((sum, kpi) => sum + kpi.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.1) {
      toast({
        title: "Error",
        description: "KPI weights must total 100%",
        variant: "destructive"
      });
      return;
    }

    const updatedTemplate = {
      ...editingTemplate,
      updatedAt: new Date().toISOString()
    };

    let updatedTemplates;
    if (isCreating) {
      updatedTemplates = [...templates, updatedTemplate];
    } else {
      updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? updatedTemplate : t
      );
    }

    saveTemplates(updatedTemplates);
    setEditingTemplate(null);
    setIsCreating(false);

    toast({
      title: "Success",
      description: `Template ${isCreating ? 'created' : 'updated'} successfully`
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    saveTemplates(updatedTemplates);
    toast({
      title: "Success",
      description: "Template deleted successfully"
    });
  };

  const addKPI = () => {
    if (!editingTemplate) return;
    
    const newKPI: KPI = {
      id: `kpi-${Date.now()}`,
      name: "",
      description: "",
      weight: 0
    };
    
    setEditingTemplate({
      ...editingTemplate,
      kpis: [...editingTemplate.kpis, newKPI]
    });
  };

  const updateKPI = (index: number, field: keyof KPI, value: string | number) => {
    if (!editingTemplate) return;
    
    const updatedKPIs = [...editingTemplate.kpis];
    updatedKPIs[index] = { ...updatedKPIs[index], [field]: value };
    
    setEditingTemplate({
      ...editingTemplate,
      kpis: updatedKPIs
    });
  };

  const removeKPI = (index: number) => {
    if (!editingTemplate) return;
    
    const updatedKPIs = editingTemplate.kpis.filter((_, i) => i !== index);
    setEditingTemplate({
      ...editingTemplate,
      kpis: updatedKPIs
    });
  };

  if (editingTemplate) {
    const totalWeight = editingTemplate.kpis.reduce((sum, kpi) => sum + kpi.weight, 0);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isCreating ? "Create New Template" : "Edit Template"}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({
                  ...editingTemplate,
                  name: e.target.value
                })}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateType">Template Type *</Label>
              <Select 
                value={editingTemplate.type} 
                onValueChange={(value: "staff" | "manager") => 
                  setEditingTemplate({ ...editingTemplate, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateDescription">Description</Label>
            <Textarea
              id="templateDescription"
              value={editingTemplate.description}
              onChange={(e) => setEditingTemplate({
                ...editingTemplate,
                description: e.target.value
              })}
              placeholder="Enter template description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Key Performance Indicators</h4>
                <p className="text-sm text-muted-foreground">
                  Total Weight: {totalWeight}% {totalWeight !== 100 && <span className="text-destructive">(Must equal 100%)</span>}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={addKPI}>
                <Plus className="h-4 w-4 mr-2" />
                Add KPI
              </Button>
            </div>

            <div className="space-y-3">
              {editingTemplate.kpis.map((kpi, index) => (
                <Card key={kpi.id}>
                  <CardContent className="pt-4">
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>KPI Name *</Label>
                        <Input
                          value={kpi.name}
                          onChange={(e) => updateKPI(index, 'name', e.target.value)}
                          placeholder="KPI name"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={kpi.description}
                          onChange={(e) => updateKPI(index, 'description', e.target.value)}
                          placeholder="KPI description"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Weight (%)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={kpi.weight}
                            onChange={(e) => updateKPI(index, 'weight', Number(e.target.value))}
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeKPI(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appraisal Templates</h3>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
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
                  <Badge variant={template.type === 'staff' ? 'default' : 'secondary'}>
                    {template.type}
                  </Badge>
                  {template.department && (
                    <Badge variant="outline">{template.department}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">KPIs ({template.kpis.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {template.kpis.map((kpi) => (
                      <Badge key={kpi.id} variant="outline">
                        {kpi.name} ({kpi.weight}%)
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};