<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluation_types', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('description');
            $table->timestamps();
        });

        //Tipos de evaluación por defecto
        DB::table("evaluation_types")
        ->insert(
        array(
            [
                "type" => "Evaluación 360°",
                "description" => "Todos los miembros de la empresa podrán evaluar al empleado"
            ],
            [
               "type" => "Autoevaluación/Test",
               "description"=> "Solo el empleado seleccionado podrá realizar esta evaluación"
            ],
            
               
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
        Schema::dropIfExists('evaluation_types');
    }
}
