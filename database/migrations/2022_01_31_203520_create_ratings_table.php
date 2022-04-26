<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRatingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->string('description')->nullable();
            $table->double('value');
          
            
            $table->bigInteger('id_rating_type')->unsigned()->index()->nullable();
            $table->foreign('id_rating_type')->references('id')->on('rating_types')
            ->onDelete('cascade')  //los sistemas de puntuación se pueden eliminar aún         
            ->onUpdate('cascade');  //cuando tengan puntuaciones asignadas (validar en caso de que tengan Score)


            $table->timestamps();
        });

         //Sistemas de puntuación por defecto
         DB::table("ratings")
         ->insert(
         array(
             [
                 "description" => "Deficiente",
                 "value" => 1.00,
                 "id_rating_type" => 1
             ],
             [
                "description" => "Regular",
                "value" => 2.00,
                "id_rating_type" => 1
             ],
             [
                "description" => "Bueno",
                "value" => 3.00,
                "id_rating_type" => 1
             ],
             [
                "description" => "Muy bueno",
                "value" => 4.00,
                "id_rating_type" => 1
            ],
            [
               "description" => "Excelente",
               "value" => 5.00,
               "id_rating_types" => 1
            ],
            ["description" => "1","value" => 1.00,"id_rating_type" => 2],
            ["description" => "2","value" => 2.00, "id_rating_types" => 2 ],
            ["description" => "3","value" => 3.00,"id_rating_type" => 2],
            ["description" => "4","value" => 4.00, "id_rating_types" => 2 ],
            ["description" => "5","value" => 5.00,"id_rating_type" => 2],
            ["description" => "6","value" => 6.00, "id_rating_types" => 2 ],
            ["description" => "7","value" => 7.00,"id_rating_type" => 2],
            ["description" => "8","value" => 8.00, "id_rating_types" => 2 ],
            ["description" => "9","value" => 9.00,"id_rating_type" => 2],
            ["description" => "10","value" => 10.00, "id_rating_types" => 2 ]
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
        Schema::dropIfExists('ratings');
    }
}
