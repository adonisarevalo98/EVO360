<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_categories', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->timestamps();
        });

        //categorias de usuario por defecto
        DB::table("user_categories")
        ->insert(
        array(
            [
                "category" => "Administrador"
            ],
            [
                "category" => "Gestor de evaluaciones"
            ],
            [
                "category" => "Empleado"
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
        Schema::dropIfExists('user_categories');
    }
}
