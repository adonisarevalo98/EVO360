<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCriteriaGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('criteria_groups', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();

            $table->bigInteger('algorithm')->unsigned()->index();
            $table->foreign('algorithm')->references('id')->on('calculation_algorithms')
            ->onDelete('restrict')         
            ->onUpdate('restrict');  

            $table->timestamps();
        });
         //Grupos de criterios por defecto
         DB::table("criteria_groups")
         ->insert(
         array(
             [
                 "title" => "Desempeño de labores",
                 "description"=>"Conjunto de criterios que permiten evaluar el desempeño de cada empleado",
                 "algorithm"=>1
             ],
             [
                "title" => "Actitudes",
                "description"=>"Conjunto de criterios que permiten evaluar la actitud e intereses de una persona",
                "algorithm"=>2
            ],
            [
                "title" => "Test de inteligencia",
                "description"=>"Conjunto de criterios que permiten evaluar los conocimientos generales de una persona",
                "algorithm"=>2
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
        Schema::dropIfExists('criteria_groups');
    }
}
