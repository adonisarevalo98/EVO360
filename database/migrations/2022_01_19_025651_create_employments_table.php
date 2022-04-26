<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmploymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employments', function (Blueprint $table) {
            $table->id();
            $table->string('employment');
            $table->string('description')->nullable();
            
            $table->bigInteger('id_department')->unsigned()->index();
            $table->foreign('id_department')->references('id')->on('departments')
            ->onDelete('restrict') //no se puede eliminar un departamento con cargos asignados,
            ->onUpdate('restrict'); //para evitar dejar empleados sin departamento

            $table->timestamps();
        });
          //Cargos por defecto
          DB::table("employments")
          ->insert(
          array(
            [
              "employment" => "NO ASIGNADO", //No debe ser eliminado
              "description" => "Para usuarios que aún no son miembros",
              "id_department" => 1
            ],
              [
                  "employment" => "Gerente Financiero/a",
                  "description" => "Administrador de finanzas",
                  "id_department" => 3
              ],
              [
                "employment" => "Auditor/ra Jr.",
                "description" => "Administrador de contabilidad",
                "id_department" => 4
              ],
              [
                "employment" => "Gerente de comercialización",
                "description" => "Administrador de operaciones comerciales",
                "id_department" => 4
              ],
              [
                "employment" => "Scrum Master",
                "description" => "Director de proyectos de sistemas",
                "id_department" => 5
             ],
             [
                "employment" => "Director de Recursos Humanos",
                "description" => "Administrador de RRHH",
                "id_department" => 6
             ]
          )
      );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employments');
    }
}
