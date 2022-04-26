<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_templates', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('description')->nullable();

            $table->bigInteger('status')->unsigned()->index()->default(1);
            $table->foreign('status')->references('id')->on('template_status')
            ->onDelete('restrict') 
            ->onUpdate('restrict');

            $table->bigInteger('group')->unsigned()->index()->nullable();
            $table->foreign('group')->references('id')->on('criteria_groups')
            ->onDelete('set null') 
            ->onUpdate('cascade');

            $table->timestamps();
        });
         //Preguntas por defecto
         DB::table("question_templates")
         ->insert(
         array(
             [
                 "type" => "Evaluación de desempeño",
                 "description" => "Medición de eficiencia y eficacia",
                 "status" => 1, 
                 "group" =>1
             ],
             [
                "type" => "Evaluación de actitud/aptitud",
                "description" => "Medición de valores y predispociones",
                "status" => 1, 
                "group" =>2
             ],
             [
                "type" => "Evaluación de inteligencia",
                "description" => "Medición de inteligencia y conocimiento general",
                "status" => 1, 
                "group" =>3
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
        Schema::dropIfExists('question_templates');
    }
}
