<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question_Template extends Model
{
    use HasFactory;
    //Estableciendo el nombre de la tabla
    /*protected ayuda a evitar que se agrege un segundo "_"
      en las consultas    
    */
    protected $table = 'question_templates';
}
