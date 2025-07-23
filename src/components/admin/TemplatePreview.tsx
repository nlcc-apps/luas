import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppraisalTemplate } from "./TemplateManager";
import { Eye, FileText, Users, Building } from "lucide-react";

export const TemplatePreview = () => {
  const [templates, setTemplates] = useState<AppraisalTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [previewTemplate, setPreviewTemplate] = useState<AppraisalTemplate | null>(null);

  useEffect(() => {
    const savedTemplates = localStorage.getItem('appraisal-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      setPreviewTemplate(template || null);
    } else {
      setPreviewTemplate(null);
    }
  }, [selectedTemplate, templates]);

  const getTemplatesByType = () => {
    const staffTemplates = templates.filter(t => t.type === 'staff');
    const managerTemplates = templates.filter(t => t.type === 'manager');
    const departmentTemplates = templates.filter(t => t.department);
    
    return { staffTemplates, managerTemplates, departmentTemplates };
  };

  const { staffTemplates, managerTemplates, departmentTemplates } = getTemplatesByType();

  const getRatingScale = () => [
    { value: 1, label: "Poor", description: "Performance significantly below expectations" },
    { value: 2, label: "Below Average", description: "Performance somewhat below expectations" },
    { value: 3, label: "Average", description: "Performance meets basic expectations" },
    { value: 4, label: "Good", description: "Performance exceeds expectations" },
    { value: 5, label: "Excellent", description: "Performance significantly exceeds expectations" }
  ];

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="template">Select Template to Preview</Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a template to preview" />
            </SelectTrigger>
            <SelectContent>
              {staffTemplates.length > 0 && (
                <>
                  <SelectItem value="staff-header" disabled className="font-medium">
                    <Users className="h-4 w-4 inline mr-2" />
                    Staff Templates
                  </SelectItem>
                  {staffTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                      {template.department && ` (${template.department})`}
                    </SelectItem>
                  ))}
                </>
              )}
              
              {managerTemplates.length > 0 && (
                <>
                  <SelectItem value="manager-header" disabled className="font-medium">
                    <Building className="h-4 w-4 inline mr-2" />
                    Manager Templates
                  </SelectItem>
                  {managerTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                      {template.department && ` (${template.department})`}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Template Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{staffTemplates.length}</p>
                  <p className="text-sm text-muted-foreground">Staff Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{managerTemplates.length}</p>
                  <p className="text-sm text-muted-foreground">Manager Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{departmentTemplates.length}</p>
                  <p className="text-sm text-muted-foreground">Dept. Specific</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Preview */}
      {previewTemplate ? (
        <div className="space-y-6">
          {/* Template Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{previewTemplate.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{previewTemplate.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={previewTemplate.type === 'staff' ? 'default' : 'secondary'}>
                    {previewTemplate.type}
                  </Badge>
                  {previewTemplate.department && (
                    <Badge variant="outline">{previewTemplate.department}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* KPIs Table Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <p className="text-sm text-muted-foreground">
                This table shows how the template will appear during appraisal evaluation
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Performance Indicator</TableHead>
                    <TableHead className="w-1/3">Description</TableHead>
                    <TableHead className="w-1/6 text-center">Weight</TableHead>
                    <TableHead className="w-1/6 text-center">Rating (1-5)</TableHead>
                    <TableHead className="w-1/6 text-center">Weighted Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewTemplate.kpis.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">{kpi.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {kpi.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{kpi.weight}%</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-sm">
                          [1-5]
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-sm">
                          [Auto]
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-center">
                      <Badge>100%</Badge>
                    </TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">[Final Score]</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Rating Scale Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Scale Reference</CardTitle>
              <p className="text-sm text-muted-foreground">
                Standard 5-point scale used across all KPIs
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/6 text-center">Rating</TableHead>
                    <TableHead className="w-1/4">Label</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRatingScale().map((rating) => (
                    <TableRow key={rating.value}>
                      <TableCell className="text-center">
                        <Badge 
                          variant={rating.value >= 4 ? 'default' : rating.value >= 3 ? 'secondary' : 'outline'}
                        >
                          {rating.value}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{rating.label}</TableCell>
                      <TableCell className="text-muted-foreground">{rating.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Template Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Template ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{previewTemplate.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Template Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{previewTemplate.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="text-sm text-muted-foreground">
                    {previewTemplate.department || 'General (All Departments)'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total KPIs</Label>
                  <p className="text-sm text-muted-foreground">{previewTemplate.kpis.length}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(previewTemplate.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(previewTemplate.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="font-medium mb-2">No Template Selected</h4>
            <p className="text-sm text-muted-foreground">
              Select a template from the dropdown above to see a detailed preview of how it will appear during evaluation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};