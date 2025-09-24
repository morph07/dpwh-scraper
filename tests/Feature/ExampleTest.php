<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

it('home page is accessible', function () {
    $response = $this->get('/');

    $response->assertOk();
});
