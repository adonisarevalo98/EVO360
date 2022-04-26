<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Declarando controladores
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmploymentController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\EvaluationItemController;
use App\Http\Controllers\EvaluationTypeController;
use App\Http\Controllers\EvaluatorController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\QuestionTemplateController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\UserCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CalculationAlgorithmController;
use App\Http\Controllers\CriterionController;
use App\Http\Controllers\CriterionGroupController;
use App\Http\Controllers\RatingTypeController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyStatusController;
use App\Http\Controllers\EvaluationStatusController;
use App\Http\Controllers\EvaluatorLevelController;
use App\Http\Controllers\EvaluatorStatusController;
use App\Http\Controllers\TemplateStatusController;
use App\Http\Controllers\UserStatusController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//sIGN UN
Route::group([
    'middleware' => ['throttle:60,1'],
], function () {
Route::post('signup', [LoginController::class, 'register']);
//LOGIN and LOGOUT
Route::post('login', [LoginController::class, 'validate_users']);
Route::post('logout', [LoginController::class, 'logout']);
});

//Grupo de rutas protegidas con ApiKey, Sanctum (tokens) y throttle (para DDoS)
Route::group([
    'middleware' => ['apikey.validate','auth:sanctum','throttle:60,1'],
], function () { 
//CRUD USERS
Route::resource('users', UserController::class);
Route::resource('user_status', UserStatusController::class);
Route::post('userdata', [UserController::class, 'getuserData']);
Route::post('users_list', [UserController::class, 'list_users']);
Route::get('users_by_department/{id}', [UserController::class, 'users_by_department']);
Route::get('arent_evaluators/{id_evaluation}/{id_company}', [UserController::class, 'arent_evaluators']);


//CRUD DEPARTMENTS
Route::resource('departments', DepartmentController::class);
Route::get('departments_by_company/{id}', [DepartmentController::class, 'list_by_company']);

//CRUD EMPLOYMENTS
Route::resource('employments', EmploymentController::class);
Route::get('employments_by_company/{id}', [EmploymentController::class, 'list_by_company']);
Route::get('employments_by_department/{id}', [EmploymentController::class, 'list_by_department']);

//CRUD EVALUATIONS_ITEMS
Route::resource('evs_items', EvaluationItemController::class);

//CRUD EVALUATION_TYPES
Route::resource('evaluation_types', EvaluationTypeController::class);

//CRUD EVALUATIONS
Route::resource('evaluations', EvaluationController::class);
Route::resource('evaluation_status', EvaluationStatusController::class);
Route::get('list_evaluations/{type}', [EvaluationController::class, 'list_evaluations']);

//CRUD EVALUATORS
Route::resource('evaluators', EvaluatorController::class);
Route::resource('evaluator_level', EvaluatorLevelController::class);
Route::resource('evaluator_status', EvaluatorStatusController::class);
Route::get('evaluations_by_user/{id}/{type}', [EvaluatorController::class, 'evaluations_by_user']);
Route::get('evaluators_by_evaluation/{id_user}/{id_evaluation}', [EvaluatorController::class, 'evaluators_by_evaluation']);
Route::get('companies_by_evaluated/{id}', [EvaluatorController::class, 'companies_by_evaluated']);
Route::get('evaluated_of_evaluation/{id}', [EvaluatorController::class, 'evaluated_of_evaluation']);
Route::get('evaluator_of_evaluation/{id_user}/{id_evaluation}', [EvaluatorController::class, 'evaluator_of_evaluation']);



//CRUD ITEMS
Route::resource('items', ItemController::class);
Route::get('list_by_template/{id}', [ItemController::class,'list_by_template']);

//CRUD QUESTIONS_TEMPLATES
Route::resource('quests_temps', QuestionTemplateController::class);
Route::resource('template_status', TemplateStatusController::class);
Route::get('list_active_temps', [QuestionTemplateController::class, 'list_active_temps']);


//CRUD RATINGS
Route::resource('ratings', RatingController::class);
Route::get('ratings_by_evaluation/{id}', [RatingController::class, 'ratings_by_evaluation']);

//CRUD RATINGS_ITEMS
Route::resource('ratings_items', RatingItemController::class);

//CRUD SCORES
Route::resource('scores', ScoreController::class);

//CRUD USERS_CATEGORIES
Route::resource('users_categories', UserCategoryController::class);

//CRUD CALCULATION_ALGORITHM
Route::resource('algorithms', CalculationAlgorithmController::class);

//CRUD CRITERIA_GROUPS
Route::resource('criteria_groups', CriterionGroupController::class);

//CRUD CRITERIA
Route::resource('criteria', CriterionController::class);
Route::get('criteria_by_group/{id}', [CriterionController::class, 'criteria_by_group']);

//CRUD RATING_TYPES
Route::resource('rating_types', RatingTypeController::class);

//CRUD COMPANIES
Route::resource('companies', CompanyController::class);
Route::resource('company_status', CompanyStatusController::class);
});
