<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserStatusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_status', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->timestamps();
        });
        //Estados por defecto
        DB::table("user_status")
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
        Schema::dropIfExists('user_status');
    }
}
