import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

interface Project {
    id: number;
    contract_id: string;
    project_name: string;
    contractor: string | null;
    status: string | null;
    contract_amount: string | null;
    physical_progress: string | null;
    region: {
        name: string;
    };
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProjectsIndexProps {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    regions: Array<{
        id: number;
        name: string;
    }>;
    statuses: string[];
    filters: {
        region?: string;
        status?: string;
        search?: string;
    };
}

export default function ProjectsIndex({ projects: projectsData, regions, statuses, filters }: ProjectsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get('/projects', {
            search: searchTerm,
            region: selectedRegion,
            status: selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRegion('');
        setSelectedStatus('');
        router.get('/projects', {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Infrastructure Projects" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Infrastructure Projects</h1>
                    <div className="text-sm text-muted-foreground">
                        {projectsData.total.toLocaleString()} total projects
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-lg p-4 border border-sidebar-border/70">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Region</label>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                            >
                                <option value="">All Regions</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                            >
                                <option value="">All Statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                            >
                                Filter
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Contract ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Project Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Region</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Contractor</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Progress</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {projectsData.data.map((project) => (
                                    <tr key={project.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                {project.contract_id}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 max-w-md">
                                            <div className="truncate" title={project.project_name}>
                                                {project.project_name || 'Unnamed Project'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{project.region.name}</td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <div className="truncate" title={project.contractor || ''}>
                                                {project.contractor || '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                project.status === 'On-Going' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {project.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {project.physical_progress ? `${project.physical_progress}%` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {project.contract_amount ?
                                                `₱${parseFloat(project.contract_amount).toLocaleString()}` :
                                                '-'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {projectsData.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-border">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((projectsData.current_page - 1) * projectsData.per_page) + 1} to {Math.min(projectsData.current_page * projectsData.per_page, projectsData.total)} of {projectsData.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {projectsData.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm rounded ${link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : link.url
                                                    ? 'border border-input hover:bg-muted'
                                                    : 'text-muted-foreground cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
