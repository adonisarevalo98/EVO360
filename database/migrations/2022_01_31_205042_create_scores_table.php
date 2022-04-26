<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('id_evaluation_item')->unsigned()->index();
            $table->foreign('id_evaluation_item')->references('id')->on('evaluations_items')
            ->onDelete('restrict') //una evaluación o un item no pueden ser eliminados o actualizados si
            ->onUpdate('restrict'); //ya tienen puntuaciones
            
            $table->bigInteger('id_evaluator')->unsigned()->index();
            $table->foreign('id_evaluator')->references('id')->on('evaluators')
            ->onDelete('restrict')  //un usuario no puede ser eliminado y su id no puede ser actualizado    
            ->onUpdate('restrict'); //si ya ha realizado evaluaciones

            $table->double('value');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('scores');
    }
}
