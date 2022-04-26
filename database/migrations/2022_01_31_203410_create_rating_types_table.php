<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRatingTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rating_types', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('description')->nullable();
            $table->timestamps();
        });
         //Preguntas por defecto
         DB::table("rating_types")
         ->insert(
         array(
             [
                 "type" => "Puntuación estándar",
                 "description" => "sistema de 5 opciones (paso 1 de 1 a 5)",
             ],
             [
                "type" => "Puntuación de exámen",
                "description" => "sistema de 10 opciones (paso 1 de 1 a 10)",
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
        Schema::dropIfExists('rating_types');
    }
}
