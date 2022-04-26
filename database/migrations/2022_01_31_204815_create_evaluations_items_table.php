<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationsItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluations_items', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('id_evaluation')->unsigned()->index();
            $table->foreign('id_evaluation')->references('id')->on('evaluations')
            ->onDelete('cascade')  //una evaluación podrá ser eliminada aún cuando tenga items
            ->onUpdate('cascade'); 

            $table->bigInteger('id_item')->unsigned()->index();
            $table->foreign('id_item')->references('id')->on('items')
            ->onDelete('cascade') //un item puede ser eliminado aún cuando este asignado a una evaluación
            ->onUpdate('cascade'); 

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
        Schema::dropIfExists('evaluations_items');
    }
}
