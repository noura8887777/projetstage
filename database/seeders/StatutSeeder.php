<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Statut;

class StatutSeeder extends Seeder
{
    public function run()
    {
        Statut::factory()->count(3)->create();
    }
}
