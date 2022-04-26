<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluatorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluators', function (Blueprint $table) {
            $table->id();
            
            $table->bigInteger('id_evaluation')->unsigned()->index();
            $table->foreign('id_evaluation')->references('id')->on('evaluations')
            ->onDelete('cascade')  //una evaluación puedra ser borrada aún cuando este asignada 
            ->onUpdate('cascade');  //a un evaluador

            $table->bigInteger('id_user')->unsigned()->index();
            $table->foreign('id_user')->references('id')->on('users')
            ->onUpdate('restrict')  //un usuario no podrá ser eliminado si ya esta asignado
            ->onUpdate('restrict'); //a una evaluación

            $table->bigInteger('level')->unsigned()->index()->default(2);
            $table->foreign('level')->references('id')->on('evaluator_levels')
            ->onDelete('restrict') 
            ->onUpdate('restrict');

            $table->bigInteger('status')->unsigned()->index()->nullable();
            $table->foreign('status')->references('id')->on('evaluator_status')
            ->onDelete('restrict') 
            ->onUpdate('restrict');


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
        Schema::dropIfExists('evaluators');
    }
}
