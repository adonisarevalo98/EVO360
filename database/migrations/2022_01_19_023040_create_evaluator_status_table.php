<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluatorStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluator_status', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->timestamps();
        });
        //Estados por defecto
        DB::table("evaluator_status")
        ->insert(
        array(
            [
                "status" => "Completado",
            ],
            [
               "status" => "No iniciado",
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
        Schema::dropIfExists('evaluator_status');
    }
}
