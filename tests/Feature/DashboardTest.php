<?php

use App\Models\Usuario;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = Usuario::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});