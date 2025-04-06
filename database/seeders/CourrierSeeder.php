<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Courrier;

class CourrierSeeder extends Seeder
{
    public function run()
    {
      
        Courrier::factory()->count(15)->create();
    }
}
