<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            UtilisateurSeeder::class,
            StatutSeeder::class,
            FichierSeeder::class,
            TypeCourrierSeeder::class,
            CourrierSeeder::class,
            AffectationSeeder::class,
        ]);
    }
}
