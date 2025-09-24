<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regions = [
            [
                'name' => 'Central Office',
                'code' => 'Central%20Office',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Central%20Office',
                'is_active' => true,
            ],
            [
                'name' => 'Cordillera Administrative Region',
                'code' => 'Cordillera%20Administrative%20Region',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Cordillera%20Administrative%20Region',
                'is_active' => true,
            ],
            [
                'name' => 'National Capital Region',
                'code' => 'National%20Capital%20Region',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=National%20Capital%20Region',
                'is_active' => true,
            ],
            [
                'name' => 'Negros Island Region',
                'code' => 'Negros%20Island%20Region',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Negros%20Island%20Region',
                'is_active' => true,
            ],
            [
                'name' => 'Region I',
                'code' => 'Region%20I',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20I',
                'is_active' => true,
            ],
            [
                'name' => 'Region II',
                'code' => 'Region%20II',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20II',
                'is_active' => true,
            ],
            [
                'name' => 'Region III',
                'code' => 'Region%20III',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20III',
                'is_active' => true,
            ],
            [
                'name' => 'Region IV-A',
                'code' => 'Region%20IV-A',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20IV-A',
                'is_active' => true,
            ],
            [
                'name' => 'Region IV-B',
                'code' => 'Region%20IV-B',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20IV-B',
                'is_active' => true,
            ],
            [
                'name' => 'Region V',
                'code' => 'Region%20V',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20V',
                'is_active' => true,
            ],
            [
                'name' => 'Region VI',
                'code' => 'Region%20VI',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20VI',
                'is_active' => true,
            ],
            [
                'name' => 'Region VII',
                'code' => 'Region%20VII',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20VII',
                'is_active' => true,
            ],
            [
                'name' => 'Region VIII',
                'code' => 'Region%20VIII',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20VIII',
                'is_active' => true,
            ],
            [
                'name' => 'Region IX',
                'code' => 'Region%20IX',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20IX',
                'is_active' => true,
            ],
            [
                'name' => 'Region X',
                'code' => 'Region%20X',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20X',
                'is_active' => true,
            ],
            [
                'name' => 'Region XI',
                'code' => 'Region%20XI',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20XI',
                'is_active' => true,
            ],
            [
                'name' => 'Region XII',
                'code' => 'Region%20XII',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20XII',
                'is_active' => true,
            ],
            [
                'name' => 'Region XIII',
                'code' => 'Region%20XIII',
                'url' => 'https://apps2.dpwh.gov.ph/infra_projects/default.aspx?region=Region%20XIII',
                'is_active' => true,
            ],
        ];

        foreach ($regions as $regionData) {
            \App\Models\Region::updateOrCreate(
                ['code' => $regionData['code']],
                $regionData
            );
        }
    }
}
