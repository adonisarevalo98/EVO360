<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('department');
            $table->string('description')->nullable();

            $table->bigInteger('id_company')->unsigned()->index()->nullable();
            $table->foreign('id_company')->references('id')->on('companies')
            ->onDelete('cascade')  //Se pueden eliminar empresas con departamentos asignados          
            ->onUpdate('cascade');  //a menos que los departamentos ya tengan cargos
            
            $table->timestamps();
        });

          //Departamentos por defecto
          DB::table("departments")
          ->insert(
          array(
               [
                "department" => "NO ASIGNADO", //No debe ser eliminado
                "description" => "Para usuarios que aún no son miembros",
                "id_company" => 1
               ],
               [
                  "department" => "Contabilidad",
                  "description" => "Encargados de procesos contables",
                  "id_company" => 2
               ],
               [
                "department" => "Gerencia",
                "description" => "Responsables de la administración",
                "id_company" => 2
               ],
               [
                "department" => "Finanzas",
                "description" => "Encargados de procesos financieros",
                "id_company" => 2
               ],
               [
                "department" => "Informática",
                "description" => "Encargados de sistemas y soporte técnico",
                "id_company" => 2
               ],
               [
                "department" => "Recursos humanos",
                "description" => "Encargados del talento y personal",
                "id_company" => 2
               ],
              
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
        Schema::dropIfExists('departments');
    }
}
