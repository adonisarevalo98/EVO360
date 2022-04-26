<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('logo')->nullable();

            $table->bigInteger('status')->unsigned()->index();
            $table->foreign('status')->references('id')->on('company_status')
            ->onDelete('restrict') 
            ->onUpdate('restrict');

            $table->timestamps();
        });
        //Empresas por defecto
        DB::table("companies")
        ->insert(
        array(
            [
                "company" => "NO ASIGNADO", //No debe ser eliminada
                "logo" => "",
                "status" => 1
             ],
             [
                "company" => "COSAVI",
                "logo" => "",
                "status" => 1,
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
        Schema::dropIfExists('companies');
    }
}
