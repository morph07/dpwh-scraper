<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('projects index is publicly accessible', function () {
    $this->get(route('projects.index'))->assertOk();
});
