import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Project {
    id: number;
    contract_id: string;
    project_name: string;
    contractor: string | null;
    status: string | null;
    contract_amount: string | null;
    physical_progress: string | null;
    region: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface ProjectShowProps {
    project: Project;
}

export default function ProjectShow({ project }: ProjectShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: '/projects',
        },
        {
            title: project.contract_id,
            href: `/projects/${project.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Project: ${project.contract_id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{project.contract_id}</h1>
                        <p className="text-muted-foreground">Infrastructure Project Details</p>
                    </div>
                    <Link
                        href="/projects"
                        className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                    >
                        Back to Projects
                    </Link>
                </div>

                {/* Project Details Card */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Project Name
                                </label>
                                <p className="text-lg">{project.project_name || 'Unnamed Project'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Contract ID
                                </label>
                                <p className="text-lg font-mono">{project.contract_id}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Region
                                </label>
                                <p className="text-lg">{project.region.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Contractor
                                </label>
                                <p className="text-lg">{project.contractor || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Status
                                </label>
                                <span className={`inline-block px-3 py-1 text-sm rounded-full ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        project.status === 'On-Going' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {project.status || 'Unknown'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Physical Progress
                                </label>
                                <p className="text-lg">
                                    {project.physical_progress ? `${project.physical_progress}%` : 'Not specified'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Contract Amount
                                </label>
                                <p className="text-lg">
                                    {project.contract_amount ?
                                        `₱${parseFloat(project.contract_amount).toLocaleString()}` :
                                        'Not specified'
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        Created
                                    </label>
                                    <p className="text-sm">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        Last Updated
                                    </label>
                                    <p className="text-sm">
                                        {new Date(project.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Actions */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Project Actions</h2>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/changes?project_id=${project.id}`}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                            >
                                View Changes
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
