<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('dashboard is publicly accessible', function () {
    $this->get(route('dashboard'))->assertOk();
});
