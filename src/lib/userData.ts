// User data management - acts as temporary database
export interface User {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  name: string;
  role: "admin" | "ceo" | "manager" | "employee";
  department: string;
  lineManager?: string; // ID of line manager
  position: string;
}

export interface AppraisalSubmission {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  submissionDate: string;
  appraisalPeriod: string;
  status: "submitted" | "available_for_manager" | "manager_completed" | "available_for_ceo" | "completed";
  lineManager: string;
  selfAppraisal: any; // The self-appraisal data
  managerEvaluation?: any; // Manager's evaluation
  ceoEvaluation?: any; // CEO's evaluation (for managers)
  scores: {
    selfRating: number;
    managerRating?: number;
    ceoRating?: number;
  };
}

// Sample users data
const defaultUsers: User[] = [
  {
    id: "admin1",
    email: "admin@company.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    department: "Administration",
    position: "System Administrator"
  },
  {
    id: "ceo1", 
    email: "ceo@company.com",
    password: "ceo123",
    name: "John CEO",
    role: "ceo",
    department: "Executive",
    position: "Chief Executive Officer"
  },
  {
    id: "mgr1",
    email: "sarah.johnson@company.com", 
    password: "mgr123",
    name: "Sarah Johnson",
    role: "manager",
    department: "Engineering",
    lineManager: "ceo1",
    position: "Engineering Manager"
  },
  {
    id: "mgr2",
    email: "mike.wilson@company.com",
    password: "mgr123", 
    name: "Mike Wilson",
    role: "manager",
    department: "Marketing",
    lineManager: "ceo1",
    position: "Marketing Manager"
  },
  {
    id: "mgr3",
    email: "david.chen@company.com",
    password: "mgr123",
    name: "David Chen", 
    role: "manager",
    department: "HR",
    lineManager: "ceo1",
    position: "HR Manager"
  },
  {
    id: "emp1",
    email: "john.smith@company.com",
    password: "emp123",
    name: "John Smith",
    role: "employee", 
    department: "Engineering",
    lineManager: "mgr1",
    position: "Software Engineer"
  },
  {
    id: "emp2",
    email: "mary.davis@company.com",
    password: "emp123",
    name: "Mary Davis",
    role: "employee",
    department: "Marketing", 
    lineManager: "mgr2",
    position: "Marketing Specialist"
  },
  {
    id: "emp3",
    email: "robert.brown@company.com",
    password: "emp123", 
    name: "Robert Brown",
    role: "employee",
    department: "Engineering",
    lineManager: "mgr1", 
    position: "Senior Developer"
  },
  {
    id: "emp4",
    email: "lisa.wilson@company.com",
    password: "emp123",
    name: "Lisa Wilson", 
    role: "employee",
    department: "HR",
    lineManager: "mgr3",
    position: "HR Specialist"
  }
];

// Sample submissions data (updated with enhanced workflow)
const defaultSubmissions: AppraisalSubmission[] = [
  {
    id: "sub1",
    employeeId: "emp1", 
    employeeName: "John Smith",
    department: "Engineering",
    submissionDate: "2024-12-15",
    appraisalPeriod: "Q4 2024", 
    status: "submitted",
    lineManager: "mgr1",
    selfAppraisal: { /* mock self-appraisal data */ },
    scores: { selfRating: 4.2 }
  },
  {
    id: "sub2",
    employeeId: "emp2",
    employeeName: "Mary Davis", 
    department: "Marketing",
    submissionDate: "2024-12-14",
    appraisalPeriod: "Q4 2024",
    status: "available_for_manager",
    lineManager: "mgr2",
    selfAppraisal: { /* mock self-appraisal data */ },
    scores: { selfRating: 3.8 }
  },
  {
    id: "sub3",
    employeeId: "emp3",
    employeeName: "Robert Brown",
    department: "Engineering", 
    submissionDate: "2024-12-13",
    appraisalPeriod: "Q4 2024",
    status: "manager_completed",
    lineManager: "mgr1", 
    selfAppraisal: { /* mock self-appraisal data */ },
    managerEvaluation: { /* mock manager evaluation */ },
    scores: { selfRating: 4.0, managerRating: 3.9 }
  },
  {
    id: "sub4",
    employeeId: "emp4",
    employeeName: "Lisa Wilson",
    department: "HR",
    submissionDate: "2025-01-10", 
    appraisalPeriod: "Q1 2025",
    status: "submitted",
    lineManager: "mgr3",
    selfAppraisal: { /* mock self-appraisal data */ },
    scores: { selfRating: 4.5 }
  }
];

// Data management functions
export const getUsers = (): User[] => {
  const stored = localStorage.getItem("appraisal_users");
  return stored ? JSON.parse(stored) : defaultUsers;
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem("appraisal_users", JSON.stringify(users));
};

export const getSubmissions = (): AppraisalSubmission[] => {
  const stored = localStorage.getItem("appraisal_submissions");
  return stored ? JSON.parse(stored) : defaultSubmissions;
};

export const saveSubmissions = (submissions: AppraisalSubmission[]): void => {
  localStorage.setItem("appraisal_submissions", JSON.stringify(submissions));
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const getDirectReports = (managerId: string): User[] => {
  const users = getUsers();
  return users.filter(user => user.lineManager === managerId);
};

export const getSubmissionsForManager = (managerId: string): AppraisalSubmission[] => {
  const submissions = getSubmissions();
  const directReports = getDirectReports(managerId);
  const reportIds = directReports.map(user => user.id);
  
  return submissions.filter(submission => reportIds.includes(submission.employeeId));
};

export const getSubmissionsForCEO = (): AppraisalSubmission[] => {
  const submissions = getSubmissions();
  const users = getUsers();
  const managers = users.filter(user => user.role === "manager");
  const managerIds = managers.map(mgr => mgr.id);
  
  return submissions.filter(submission => managerIds.includes(submission.employeeId));
};

// Initialize data if not exists
export const initializeData = (): void => {
  if (!localStorage.getItem("appraisal_users")) {
    saveUsers(defaultUsers);
  }
  if (!localStorage.getItem("appraisal_submissions")) {
    saveSubmissions(defaultSubmissions);
  }
};