<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run()
    {
        // User::factory()->count(10)->create();
        User::create([
            'name'=> 'doe',
            'email'=> 'doe@gmail.com',
            'password'=> Hash::make(12341234),
            'role_id'=> 1,
        ]);
    }
}
