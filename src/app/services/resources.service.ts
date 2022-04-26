import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  //LLave para el grupo de rutas en Laravel
//Key = "?api_key=key_cur_prod_c0s4v1ftPqyBiQEf7Vcb9wKwbCf65c378VGyCB";

//Obteniendo API_KEY desde environment
Key=environment.API_KEY;
appkey=environment.APP_KEY;

//Enlace al servidor local 
baseUrl = "http://localhost:8000/api/"

 //CRUD de tabla users 
 baseUrl_users:string = this.baseUrl+"users";
 baseUrl_list_users:string = this.baseUrl+"users_list";
 baseUrl_getdata:string = this.baseUrl+"userdata";
 baseUrl_users_by_department:string = this.baseUrl+"users_by_department/";
 baseUrl_userStatus:string = this.baseUrl+"user_status";
 baseUrl_arent_evaluators:string = this.baseUrl+"arent_evaluators/";
 
 //CRUD de tabla departments 
 baseUrl_departments:string = this.baseUrl+"departments";
 baserUrl_departments_by_company:string = this.baseUrl+"departments_by_company/";

 //CRUD de tabla employments 
 baseUrl_employments:string = this.baseUrl+"employments";
 baserUrl_employments_by_company:string = this.baseUrl+"employments_by_company/";
 baserUrl_employments_by_department:string = this.baseUrl+"employments_by_department/";

 //CRUD de tabla evaluations_items 
 baseUrl_evs_items:string = this.baseUrl+"evs_items";

  //CRUD de tabla evaluation_types 
  baseUrl_evaluation_types:string = this.baseUrl+"evaluation_types";

 //CRUD de tabla evaluations
 baseUrl_evaluations:string = this.baseUrl+"evaluations";
 baseUrl_list_evaluations:string = this.baseUrl+"list_evaluations/";
 baseUrl_evaluationStatus:string = this.baseUrl+"evaluation_status";
 
 //CRUD de tabla evaluators
 baseUrl_evaluators:string = this.baseUrl+"evaluators";
 baseUrl_evaluatorLevel:string = this.baseUrl+"evaluator_level";
 baseUrl_evaluatorStatus:string = this.baseUrl+"evaluator_status";
 baseUrl_evaluations_by_user:string = this.baseUrl+"evaluations_by_user/";
 baseUrl_evaluators_by_evaluation:string = this.baseUrl+"evaluators_by_evaluation/";
 baseUrl_companies_by_evaluated:string = this.baseUrl+"companies_by_evaluated/";
 baseUrl_evaluated_of_evaluation:string = this.baseUrl+"evaluated_of_evaluation/";
 baseUrl_evaluator_of_evaluation:string = this.baseUrl+"evaluator_of_evaluation/";
 
 //CRUD de tabla items
 baseUrl_items:string = this.baseUrl+"items";
 baseUrl_items_list:string = this.baseUrl+"list_by_template/";

 //CRUD de tabla questions_templates
 baseUrl_quests_temps:string = this.baseUrl+"quests_temps";
 baseUrl_templateStatus:string = this.baseUrl+"template_status";
 baseUrl_list_active_temps:string = this.baseUrl+"list_active_temps";


 //CRUD de tabla rating_types
 baseUrl_ratings_types:string = this.baseUrl+"rating_types";
 baseUrl_ratings_by_evaluation:string = this.baseUrl+"ratings_by_evaluation/";
 

 //CRUD de tabla ratings
 baseUrl_ratings:string = this.baseUrl+"ratings";

 //CRUD de tabla scores
 baseUrl_scores:string = this.baseUrl+"scores";

 //CRUD de tabla users_categories
 baseUrl_users_categories:string = this.baseUrl+"users_categories";

 //CRUD de tabla calculation_algorithms
 baseUrl_algorithms:string = this.baseUrl+"algorithms";

 
 //CRUD de tabla criteria
 baseUrl_criteria:string = this.baseUrl+"criteria";
 baseUrl_criteria_by_group:string = this.baseUrl+"criteria_by_group/";
 

 //CRUD de tabla criteria_groups 
 baseUrl_criteria_groups:string = this.baseUrl+"criteria_groups";

 //CRUD de tabla companies
 baseUrl_companies:string = this.baseUrl+"companies";
 baseUrl_companyStatus:string = this.baseUrl+"company_status";
 
constructor() { }
}
