<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar')->nullable();

            $table->bigInteger('id_user_category')->unsigned()->index();
            $table->foreign('id_user_category')->references('id')->on('user_categories')
            ->onDelete('restrict') //no se pueden eliminar categorias de usuario que ya han 
            ->onUpdate('cascade');// sido asignadas a empleados

            $table->bigInteger('id_employment')->unsigned()->index()->nullable();
            $table->foreign('id_employment')->references('id')->on('employments')
            ->onDelete('restrict') //no se pueden eliminar categorias de empleo cuando han
            ->onUpdate('cascade');//sido asignadas a empleados

            $table->bigInteger('status')->unsigned()->index()->default(1);
            $table->foreign('status')->references('id')->on('user_status')
            ->onDelete('restrict') 
            ->onUpdate('restrict');

            $table->rememberToken();
            $table->timestamps();
        });

        //usuario por defecto
        DB::table("users")
        ->insert(
        array(
             [
                "name" => "Adonis",
                "last_name" => "Cortez",
                "email" => "sistemasbc@gmail.com",
                "password" => '$2y$10$sur8wOP3eDocxgj62YZABuU4OJAnk3BTGKyYDFOg0i5QsG68dB4.i', //sistemas2021
                "avatar" => "", 
                "id_user_category" => 1,
                "id_employment" => 4,
                "status" => 1
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
        Schema::dropIfExists('users');
    }
}
