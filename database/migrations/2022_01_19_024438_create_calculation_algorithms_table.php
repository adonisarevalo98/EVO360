<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalculationAlgorithmsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calculation_algorithms', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->timestamps();
        });
         //Algoritmos por defecto
         DB::table("calculation_algorithms")
         ->insert(
         array(
             [
                 "title" => "Algoritmo por porcentajes",
                 "description" => "Permite asignar un porcentaje de la evaluación a cada criterio",
              ],
              [
                 "title" => "Algoritmo básico",
                 "logo" => "El resultado de la evaluación se obtiene con el promedio de puntajes obtenidos",
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
        Schema::dropIfExists('calculation_algorithms');
    }
}
