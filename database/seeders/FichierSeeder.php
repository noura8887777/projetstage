<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fichier;

class FichierSeeder extends Seeder
{
    public function run()
    {
        Fichier::factory()->count(10)->create();
    }
}