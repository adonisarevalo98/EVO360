<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompanyStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('company_status', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->timestamps();
        });
          //Estados por defecto
          DB::table("company_status")
          ->insert(
          array(
              [
                  "status" => "Activado",
              ],
              [
                 "status" => "Desactivado",
                 
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
        Schema::dropIfExists('company_status');
    }
}
