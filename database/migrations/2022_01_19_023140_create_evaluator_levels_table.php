<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluatorLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluator_levels', function (Blueprint $table) {
            $table->id();
            $table->string('level');
            $table->timestamps();
        });
         //Niveles de evaluador por defecto
         DB::table("evaluator_levels")
         ->insert(
         array(
             [
                 "level" => "Creador",
             ],
             [
                "level" => "Evaluador",
                
             ],
             [
                "level" => "Evaluado",
                
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
        Schema::dropIfExists('evaluator_levels');
    }
}
