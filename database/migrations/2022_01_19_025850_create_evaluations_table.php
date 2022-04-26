<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->timestamp('start_date')->useCurrent();
            $table->timestamp('end_date')->useCurrent();

            $table->bigInteger('type')->unsigned()->index()->default(1);
            $table->foreign('type')->references('id')->on('evaluation_types')
            ->onDelete('restrict') 
            ->onUpdate('restrict');

              $table->bigInteger('status')->unsigned()->index()->default(1);
            $table->foreign('status')->references('id')->on('evaluation_status')
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
        Schema::dropIfExists('evaluations');
    }
}
