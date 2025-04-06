<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StatutFactory extends Factory
{
    public function definition()
    {
        return [
            'nom_statut' => $this->faker->randomElement(["en cours","termine"]),
        ];
    }
}