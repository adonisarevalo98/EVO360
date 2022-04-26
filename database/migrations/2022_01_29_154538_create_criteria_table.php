<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCriteriaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('criteria', function (Blueprint $table) {
            $table->id();
            $table->string('criterion');
            $table->string('description')->nullable();
            $table->double('percentage',5,2)->nullable();

            $table->bigInteger('group')->unsigned()->index()->nullable();
            $table->foreign('group')->references('id')->on('criteria_groups')
            ->onDelete('cascade') //Al eliminar un grupo de criterios se eliminan
            ->onUpdate('cascade');//todos sus criterios (a menos que ya esten asignados a items)

            $table->timestamps();
        });

        //Preguntas por defecto
        DB::table("criteria")
        ->insert(
        array(
            [
                "criterion" => "Fluidez en la comunicación",
                "description" => "Capacidad de expresión y espontaneidad",
                "percentage"=>20.00,
                "group"=>1
            ],
            [
                "criterion" => "Trabajo en equipo",
                "description" => "Capacidad de trabajar de forma coordinada e inteligente orientado a objetivos compartidos",
                "percentage"=>20.00,
                "group"=>1
            ],
            [
                "criterion" => "Resolución de conflictos",
                "description" => "Capacidad de tomar deciciones y medidad para resolver problemas ",
                "percentage"=>20.00,
                "group"=>1
            ],
            [
                "criterion" => "Atención al cliente",
                "description" => "Capacidad de apoyo y relación hacia los clientes",
                "percentage"=>20.00,
                "group"=>1
           ],
           [
            "criterion" => "Criterio 5",
            "description" => "Criterio de prueba",
            "percentage"=>20.00,
            "group"=>1
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
        Schema::dropIfExists('criteria');
    }
}
