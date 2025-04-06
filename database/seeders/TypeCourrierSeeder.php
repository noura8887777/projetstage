<?php

namespace Database\Seeders;
use App\Models\TypeCourrier;
use Illuminate\Database\Seeder;


class TypeCourrierSeeder extends Seeder
{
    public function run()
    {
        // Crée 5 types de courrier avec des données factices
        TypeCourrier::factory()->count(5)->create();
    }
}
