<?php

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('changes index is publicly accessible', function () {
    $this->get(route('changes.index'))->assertOk();
});
