<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->integer('question_origin')->comment('template=0;personalized=1');
            $table->integer('question_type')->comment('open=0;closed=1');
            $table->string('comment')->nullable();

            $table->bigInteger('id_template')->unsigned()->index()->nullable();
            $table->foreign('id_template')->references('id')->on('question_templates')
            ->onDelete('cascade')  //las plantillas de items pueden ser eliminadas          
            ->onUpdate('restrict');  //pero no se borrarán sus items

            $table->bigInteger('id_rating_type')->unsigned()->index()->nullable();
            $table->foreign('id_rating_type')->references('id')->on('rating_types')
            ->onDelete('restrict')  //un sistema de evalución no puede ser eliminado si ya esta asignado          
            ->onUpdate('restrict');  //a un item 

            $table->bigInteger('id_criterion')->unsigned()->index()->nullable();
            $table->foreign('id_criterion')->references('id')->on('criteria')
            ->onDelete('restrict')  //los criterios de evaluación no pueden ser eliminados ya que        
            ->onUpdate('restrict');  // sus items requieren los porcentajes para realizar cálculos de resultados

            $table->timestamps();
        });
           //Preguntas por defecto
           DB::table("items")
           ->insert(
           array(
               [
                   "question" => "Pregunta 1",
                   "question_origin" => 0,
                   "question_type" => 1, 
                   "comment" => "primera pregunta",
                   "id_template" => 1,
                   "id_rating_type"=>1,
                   "id_criterion" => 1
               ],
               [
                "question" => "Pregunta 2",
                "question_origin" => 0,
                "question_type" => 1, 
                "comment" => "segunda pregunta",
                "id_template" => 1,
                "id_rating_type"=>1,
                "id_criterion" => 1
               ],
               [
                "question" => "Pregunta 3",
                "question_origin" => 0,
                "question_type" => 1, 
                "comment" => "tercera pregunta",
                "id_template" => 1,
                "id_rating_type"=>1,
                "id_criterion" => 2
               ],
               [
                "question" => "Pregunta 4",
                "question_origin" => 0,
                "question_type" => 1, 
                "comment" => "cuarta pregunta",
                "id_template" => 1,
                "id_rating_type"=>1,
                "id_criterion" => 3
              ],
              [
                "question" => "Pregunta 5",
                "question_origin" => 0,
                "question_type" => 1, 
                "comment" => "quinta pregunta",
                "id_template" => 1,
                "id_rating_type"=>1,
                "id_criterion" => 4
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
        Schema::dropIfExists('items');
    }
}
