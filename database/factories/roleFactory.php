<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    public function definition()
    {
        return [
            'nom_role' =>  $this->faker->randomElement(['super-admin', 'chef-Service']),
        ];
    }
}