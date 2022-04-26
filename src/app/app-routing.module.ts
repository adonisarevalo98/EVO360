import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Login y general
import {IndexComponent} from './components/index/index.component'
import { LoginComponent } from './components/login/login.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { CompanyDeniedComponent } from './components/company-denied/company-denied.component';
//Componentes de administrador
import { AdministratorComponent } from './components/administrator/administrator.component';
import { AdminDashboardComponent } from './components/administrator/admin-dashboard/admin-dashboard.component';
import { CreateUserComponent } from './components/administrator/user/create-user/create-user.component';
import { ListUserComponent } from './components/administrator/user/list-user/list-user.component';
import { UpdateUserComponent } from './components/administrator/user/update-user/update-user.component';
import { DepartmentComponent } from './components/administrator/department/department.component';
import { ListDepartmentComponent } from './components/administrator/department/list-department/list-department.component';
import { EmploymentComponent } from './components/administrator/employment/employment.component';
import { ListEmploymentComponent } from './components/administrator/employment/list-employment/list-employment.component';
import { ListTemplateComponent } from './components/administrator/question-template/list-template/list-template.component';
import { ListItemComponent } from './components/administrator/item/list-item/list-item.component';
import { ListCompanyComponent } from './components/administrator/company/list-company/list-company.component';
import { ListCriteriaComponent } from './components/administrator/criteria/list-criteria/list-criteria.component';
import { ListCriteriaGroupsComponent } from './components/administrator/criteria-groups/list-criteria-groups/list-criteria-groups.component';
//Componentes de evaluador
import { EvaluationManagerComponent } from './components/evaluation-manager/evaluation-manager.component';
import { ManagerDashboardComponent } from './components/evaluation-manager/manager-dashboard/manager-dashboard.component';
import { ManagerDeniedComponent } from './components/evaluation-manager/manager-denied/manager-denied.component';
import { CreateEvaluationComponent } from './components/administrator/evaluation/create-evaluation/create-evaluation.component';
import { ListEvaluatorsComponent } from './components/administrator/evaluators/list-evaluators/list-evaluators.component';
//Componentes de empleado
import { ListEvaluationComponent } from './components/administrator/evaluation/list-evaluation/list-evaluation.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeDeniedComponent } from './components/employee/employee-denied/employee-denied.component';
import { EvaluatingComponent } from './components/employee/evaluating/evaluating.component';

/********************************************  Guardianes ***************************************/
//admin ()
import { AdminGuard } from "./guards/admin.guard";
//empleado (Sin denegaciones==Acceso a sus módulos)
import {EmployeeGuard} from "./guards/employee.guard"
//empleado (Con denegaciones==Acceso a componentes básicos)
import { FreeEmployeeGuard } from './guards/free-employee.guard';
//Gestor de evaluaciones (Sin denegaciones==Acceso a sus módulos)
import {EvaluationManagerGuard} from "./guards/evaluation-manager.guard"
//Gestor de evaluaciones (Con denegaciones==Acceso a componentes básicos)
import { FreeManagerGuard } from './guards/free-manager.guard';
//Para acceder a componentes teniendo acceso denegado (vista de alertas)
import { DenyEmployeeGuard } from './guards/deny-employee.guard';
import { DenyManagerGuard } from './guards/deny-manager.guard';
//Usuarios logeados (bloqueo de componente para inicio de sesión)
import {LogedinGuard} from "./guards/logedin.guard"

const routes: Routes = [
  //patmatch para que la ruta coincida completa
  { path: '', redirectTo: '/index', pathMatch: 'full'},
  { path: 'index', component:IndexComponent  } ,
  {path: 'login', component: LoginComponent,canActivate:[LogedinGuard]},
 //Rutas de Administrador
  {path: 'admin-dashboard', component: AdminDashboardComponent, canActivate:[AdminGuard]},
  {path: 'create-user', component: CreateUserComponent, canActivate:[AdminGuard]},
  {path: 'list-user', component: ListUserComponent, canActivate:[AdminGuard]},
  {path: 'update-user', component: UpdateUserComponent, canActivate:[AdminGuard]},
  {path: 'list-department', component: ListDepartmentComponent, canActivate:[AdminGuard]},
  {path: 'list-employment', component: ListEmploymentComponent, canActivate:[AdminGuard]},
  {path: 'list-template', component: ListTemplateComponent, canActivate:[AdminGuard]},
  {path: 'list-item/:id', component: ListItemComponent, canActivate:[AdminGuard]},
  {path: 'list-company', component: ListCompanyComponent, canActivate:[AdminGuard]},
  {path: 'list-criteria-groups', component: ListCriteriaGroupsComponent, canActivate:[AdminGuard]},
  {path: 'list-criteria', component: ListCriteriaComponent, canActivate:[AdminGuard]},
  
  //Rutas de Evaluation Manager
  {path: 'create-evaluation/:type', component: CreateEvaluationComponent, canActivate:[EvaluationManagerGuard]},
  //Se tienen dos enlaces para listar la misma componente de ListEvaluations
  //Ya que si se quisiera usar una sola ruta, aunque se cambie el type no recarga la página ni la lista
  {path: 'list-evaluation/:type', component: ListEvaluationComponent, canActivate:[EmployeeGuard]},
  {path: 'list-autoevaluation/:type', component: ListEvaluationComponent, canActivate:[EmployeeGuard]},
  {path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate:[FreeManagerGuard]},
  {path: 'manager-denied', component: ManagerDeniedComponent,canActivate:[DenyManagerGuard]},
  {path: 'list-evaluator', component: ListEvaluatorsComponent,canActivate:[EvaluationManagerGuard]},
  //Rutas de Employee
  {path: 'employee-dashboard', component: EmployeeDashboardComponent, canActivate:[FreeEmployeeGuard]},
  {path: 'employee-denied', component: EmployeeDeniedComponent, canActivate:[DenyEmployeeGuard]},
  {path: 'evaluating', component: EvaluatingComponent, canActivate:[EmployeeGuard]},
 


  //Wild Card Route for 404 request (poner de ultimo ya que que las rutas se evalúan en orden)
  { path: '**', pathMatch: 'full', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
