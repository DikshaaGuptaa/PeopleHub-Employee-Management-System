
import { Component } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-employees',
  imports: [ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})

export class Employees {

  showAddForm: boolean = false;
  isEditMode: boolean = false;

  selectedEmployeeId: number | null = null;

  formError: string = '';

  employeeForm: FormGroup;

  private nextEmployeeId: number = 6;

  // Initial employee data
  private initialEmployees: Employee[] = [
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav@peoplehub.com',
      department: 'Engineering',
      designation: 'Software Engineer',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Priya Verma',
      email: 'priya@peoplehub.com',
      department: 'HR',
      designation: 'HR Manager',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Rahul Mehta',
      email: 'rahul@peoplehub.com',
      department: 'Finance',
      designation: 'Financial Analyst',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Ananya Singh',
      email: 'ananya@peoplehub.com',
      department: 'Engineering',
      designation: 'Frontend Developer',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Kabir Malhotra',
      email: 'kabir@peoplehub.com',
      department: 'Marketing',
      designation: 'Marketing Executive',
      status: 'Active'
    }
  ];

  employees: Employee[] = [];

  constructor(private fb: FormBuilder) {

    this.employeeForm = this.fb.group({

      name: [
        '',
        [Validators.required, Validators.pattern(/\S/)]
      ],

      email: [
        '',
        [Validators.required, Validators.email]
      ],

      department: [
        '',
        Validators.required
      ],

      designation: [
        '',
        [Validators.required, Validators.pattern(/\S/)]
      ],

      status: [
        'Active',
        Validators.required
      ]

    });

    // Load employees from localStorage
    const savedEmployees = localStorage.getItem('peoplehub_employees');

    if (savedEmployees !== null) {
      this.employees = JSON.parse(savedEmployees);
    } else {
      this.employees = [...this.initialEmployees];
      this.saveEmployees();
    }

    // Generate next employee ID
    this.nextEmployeeId =
      this.employees.length > 0
        ? Math.max(...this.employees.map(e => e.id)) + 1
        : 1;

  }

  // Save employees to localStorage
  private saveEmployees(): void {

    localStorage.setItem(
      'peoplehub_employees',
      JSON.stringify(this.employees)
    );

  }

  // Duplicate email validation
  private isDuplicateEmail(
    email: string,
    excludeEmployeeId: number | null = null
  ): boolean {

    const normalizedEmail = email.trim().toLowerCase();

    return this.employees.some(employee => {

      return (
        employee.email.trim().toLowerCase() === normalizedEmail &&
        employee.id !== excludeEmployeeId
      );

    });

  }

  // Reset form
  private resetForm(): void {

    this.employeeForm.reset({
      name: '',
      email: '',
      department: '',
      designation: '',
      status: 'Active'
    });

    this.formError = '';

  }

  // Open add form
  openAddForm(): void {

    this.isEditMode = false;
    this.selectedEmployeeId = null;

    this.resetForm();

    this.showAddForm = true;

  }

  // Close form
  closeAddForm(): void {

    this.showAddForm = false;
    this.isEditMode = false;
    this.selectedEmployeeId = null;

    this.resetForm();

  }

  // Add employee
  addEmployee(): void {

    this.formError = '';

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formData = this.employeeForm.getRawValue();

    if (this.isDuplicateEmail(formData.email)) {

      this.formError =
        'An employee with this email already exists.';

      return;

    }

    const newEmployee: Employee = {

      id: this.nextEmployeeId++,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department,
      designation: formData.designation.trim(),
      status: formData.status

    };

    this.employees = [...this.employees, newEmployee];

    this.saveEmployees();

    this.closeAddForm();

  }

  // Edit employee
  editEmployee(employee: Employee): void {

    const existingEmployee = this.employees.find(
      e => e.id === employee.id
    );

    this.isEditMode = true;
    this.selectedEmployeeId = employee.id;

    this.resetForm();

    this.showAddForm = true;

    if (!existingEmployee) {

      this.formError =
        'This employee no longer exists and cannot be edited.';

      return;

    }

    this.employeeForm.patchValue({

      name: existingEmployee.name,
      email: existingEmployee.email,
      department: existingEmployee.department,
      designation: existingEmployee.designation,
      status: existingEmployee.status

    });

  }

  // Update employee
  updateEmployee(): void {

    this.formError = '';

    if (this.selectedEmployeeId === null) {

      this.formError = 'No employee selected for updating.';
      return;

    }

    const employeeIndex = this.employees.findIndex(
      employee => employee.id === this.selectedEmployeeId
    );

    if (employeeIndex === -1) {

      this.formError =
        'This employee has been deleted and can no longer be updated.';

      return;

    }

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();
      return;

    }

    const formData = this.employeeForm.getRawValue();

    if (
      this.isDuplicateEmail(
        formData.email,
        this.selectedEmployeeId
      )
    ) {

      this.formError =
        'Another employee already uses this email address.';

      return;

    }

    const updatedEmployee: Employee = {

      id: this.selectedEmployeeId,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      department: formData.department,
      designation: formData.designation.trim(),
      status: formData.status

    };

    this.employees = this.employees.map(employee =>

      employee.id === this.selectedEmployeeId
        ? updatedEmployee
        : employee

    );

    this.saveEmployees();

    this.closeAddForm();

  }

  // Delete employee
  deleteEmployee(employeeId: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this employee?'
    );

    if (!confirmed) {
      return;
    }

    const employeeExists = this.employees.some(
      employee => employee.id === employeeId
    );

    if (!employeeExists) {
      return;
    }

    this.employees = this.employees.filter(
      employee => employee.id !== employeeId
    );

    this.saveEmployees();

    if (this.selectedEmployeeId === employeeId) {

      this.formError =
        'This employee has been deleted. You cannot update this record.';

    }

  }

}
