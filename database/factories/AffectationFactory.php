<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AffectationFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'courrier_id' => \App\Models\Courrier::factory(),
            'reponse' => $this->faker->boolean,
            'duree_reponse' => $this->faker->numberBetween(1, 30),
        ];
    }
}