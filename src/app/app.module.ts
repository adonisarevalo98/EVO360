
//Modulos
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from "@angular/common";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatInputModule } from '@angular/material/input';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';



//Guardianes
import {AdminGuard} from './guards/admin.guard';
import {EmployeeGuard} from './guards/employee.guard';
import {LogedinGuard} from './guards/logedin.guard';
import {EvaluationManagerGuard} from './guards/evaluation-manager.guard';
import { DenyEmployeeGuard } from './guards/deny-employee.guard';
import { DenyManagerGuard } from './guards/deny-manager.guard';
import { FreeEmployeeGuard } from './guards/free-employee.guard';
import { FreeManagerGuard } from './guards/free-manager.guard';

//Componentes
import { AppComponent } from './app.component';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LoginComponent } from './components/login/login.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndexComponent } from './components/index/index.component';
import { AdminDashboardComponent } from './components/administrator/admin-dashboard/admin-dashboard.component';
import { EvaluationManagerComponent } from './components/evaluation-manager/evaluation-manager.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ManagerDashboardComponent } from './components/evaluation-manager/manager-dashboard/manager-dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserComponent } from './components/administrator/user/user.component';
import { CreateUserComponent } from './components/administrator/user/create-user/create-user.component';
import { UpdateUserComponent } from './components/administrator/user/update-user/update-user.component';
import { ListUserComponent } from './components/administrator/user/list-user/list-user.component';
import { SearchFilterPipe } from './components/search-filter/search-filter.pipe';
import { DepartmentComponent } from './components/administrator/department/department.component';
import { ListDepartmentComponent } from './components/administrator/department/list-department/list-department.component';
import { EmploymentComponent } from './components/administrator/employment/employment.component';
import { ListEmploymentComponent } from './components/administrator/employment/list-employment/list-employment.component';
import { ItemComponent } from './components/administrator/item/item.component';
import { QuestionTemplateComponent } from './components/administrator/question-template/question-template.component';
import { ListTemplateComponent } from './components/administrator/question-template/list-template/list-template.component';
import { ListItemComponent } from './components/administrator/item/list-item/list-item.component';
import { EvaluationComponent } from './components/administrator/evaluation/evaluation.component';
import { ListEvaluationComponent } from './components/administrator/evaluation/list-evaluation/list-evaluation.component';
import { CreateEvaluationComponent } from './components/administrator/evaluation/create-evaluation/create-evaluation.component';
import { ManagerDeniedComponent } from './components/evaluation-manager/manager-denied/manager-denied.component';
import { EmployeeDeniedComponent } from './components/employee/employee-denied/employee-denied.component';
import { CompanyDeniedComponent } from './components/company-denied/company-denied.component';
import { EvaluatingComponent } from './components/employee/evaluating/evaluating.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EvaluatorsComponent } from './components/administrator/evaluators/evaluators.component';
import { ListEvaluatorsComponent } from './components/administrator/evaluators/list-evaluators/list-evaluators.component';
import { CompanyComponent } from './components/administrator/company/company.component';
import { ListCompanyComponent } from './components/administrator/company/list-company/list-company.component';
import { CriteriaGroupsComponent } from './components/administrator/criteria-groups/criteria-groups.component';
import { ListCriteriaGroupsComponent } from './components/administrator/criteria-groups/list-criteria-groups/list-criteria-groups.component';
import { CriteriaComponent } from './components/administrator/criteria/criteria.component';
import { ListCriteriaComponent } from './components/administrator/criteria/list-criteria/list-criteria.component';

@NgModule({
  declarations: [
    AppComponent,
    AdministratorComponent,
    EmployeeComponent,
    LoginComponent,
    UserHeaderComponent,
    FooterComponent,
    IndexComponent,
    AdminDashboardComponent,
    EvaluationManagerComponent,
    EmployeeDashboardComponent,
    TopbarComponent,
    ManagerDashboardComponent,
    NotfoundComponent,
    UserComponent,
    CreateUserComponent,
    UpdateUserComponent,
    ListUserComponent,
    SearchFilterPipe,
    DepartmentComponent,
    ListDepartmentComponent,
    EmploymentComponent,
    ListEmploymentComponent,
    ItemComponent,
    QuestionTemplateComponent,
    ListTemplateComponent,
    ListItemComponent,
    EvaluationComponent,
    ListEvaluationComponent,
    CreateEvaluationComponent,
    ManagerDeniedComponent,
    EmployeeDeniedComponent,
    CompanyDeniedComponent,
    EvaluatingComponent,
    SidebarComponent,
    EvaluatorsComponent,
    ListEvaluatorsComponent,
    CompanyComponent,
    ListCompanyComponent,
    CriteriaGroupsComponent,
    ListCriteriaGroupsComponent,
    CriteriaComponent,
    ListCriteriaComponent
  
  ],
  imports: [
    BrowserModule, CommonModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    FormsModule,  HttpClientModule,
    BrowserAnimationsModule,ReactiveFormsModule,
    NgbModule,MDBBootstrapModule.forRoot(),MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule, MatRadioModule
  ],
  providers: [LogedinGuard, AdminGuard, EmployeeGuard, 
    EvaluationManagerGuard, DenyEmployeeGuard, DenyManagerGuard,
  FreeEmployeeGuard, FreeManagerGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
